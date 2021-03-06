import { ISeriesAxisSides, IYAxisConf, IYAxis, IGraphicProps } from "../../components/viewpage/graphic/Graphic";
import { getFullSerieId } from "../common/fullSerieID";
import { ISerie } from "../../api/Serie";
import SerieConfig from "../../api/SerieConfig";
import { formatterForSerie, IFormatterForSerieConfig } from "./formatterForSerie";
import { valuesFromObject } from "../common/commonFunctions";

export interface IYAxisGenerationOptions {
    axisSides?: ISeriesAxisSides;
    decimalLeftAxis?: number;
    decimalRightAxis?: number;
    locale: string;
    series: ISerie[];
    seriesConfig: SerieConfig[];
    numbersAbbreviate: boolean;
    decimalsBillion: number;
    decimalsMillion: number;
}

function isOutOfScale(originalSerieId: string, serieId: string, minAndMaxValues: {}): boolean {
    return minAndMaxValues[originalSerieId].min > minAndMaxValues[serieId].max ||
           minAndMaxValues[originalSerieId].max < minAndMaxValues[serieId].min;
}

function getYAxisSide(serieID:string, outOfScale: boolean, axisSideConf?: ISeriesAxisSides, ) {
    
    if (axisSideConf !== undefined && axisSideConf[serieID] !== undefined) {
        return axisSideConf[serieID];
    }
    if (outOfScale) {
        return 'right';
    }
    return 'left';

}

export function buildYAxisGenerationOptions(props: IGraphicProps): IYAxisGenerationOptions {

    return {
        axisSides: props.seriesAxis,
        decimalLeftAxis: props.decimalLeftAxis,
        decimalRightAxis: props.decimalRightAxis,
        decimalsBillion: props.decimalsBillion,
        decimalsMillion: props.decimalsMillion,
        locale: props.locale,
        numbersAbbreviate: props.numbersAbbreviate,
        series: props.series,
        seriesConfig: props.seriesConfig
    }

}

export function generateYAxisBySeries(options: IYAxisGenerationOptions): {} {

    const minAndMaxValues = options.series.reduce((result: any, serie: ISerie) => {

        const fullId = getFullSerieId(serie);
        result[fullId] = { min: serie.minValue, max: serie.maxValue };

        return result;
    }, {});

    
    return options.series.slice().sort((serie: ISerie) => serie.minValue).reduce((result: IYAxisConf, serie: ISerie) => {

        const fullId = getFullSerieId(serie);
        const outOfScale = isOutOfScale(getFullSerieId(options.series[0]), fullId, minAndMaxValues);
        const yAxisSide = getYAxisSide(fullId, outOfScale, options.axisSides);
        const rightSided = yAxisSide === 'right';

        result[fullId] = {
            opposite: rightSided ? true : false,
            title: { text: serie.representationModeUnits }
        };

        const serieConfig = options.seriesConfig.find((config: SerieConfig) => config.getFullSerieId() === fullId);

        if (serieConfig) {
            const decimalPlaces = rightSided ? options.decimalRightAxis : options.decimalLeftAxis;
            const formatterConfig: IFormatterForSerieConfig = {
                decimalPlaces,
                decimalsBillion: options.decimalsBillion,
                decimalsMillion: options.decimalsMillion,
                isPercentage: serieConfig.isPercentageSerie(),
                locale: options.locale,
                numbersAbbreviate: options.numbersAbbreviate
            }
            result[fullId].labels = formatterForSerie(formatterConfig);
        }

        return result;
    }, {});
    
}

export function generateYAxisArray(yAxisBySeries: IYAxisConf) {

    const configs = valuesFromObject(yAxisBySeries);
    if (configs.length === 0) { return []}

    let leftAxis: IYAxis[] = [];
    let rightAxis: IYAxis[] = [];

    configs.forEach((config: IYAxis) => {
        config.opposite ? rightAxis.push(config) : leftAxis.push(config);
    });

    const leftAxisTitles = leftAxis.map((v:IYAxis)=> v.title.text);
    const rightAxisTitles = rightAxis.map((v:IYAxis)=> v.title.text);

    leftAxis = leftAxis.filter((item: IYAxis, pos: number) => leftAxisTitles.indexOf(item.title.text) === pos);
    rightAxis = rightAxis.filter((item: IYAxis, pos: number) => rightAxisTitles.indexOf(item.title.text) === pos);

    // Case where there are only right-sided axis
    if(leftAxis.length === 0) {
        rightAxis.forEach((rightConfig: IYAxis) => {
            const originalLabels = rightConfig.labels;
            rightConfig.labels = {
                ...originalLabels,
                align: 'left'
            }
        })
    }
    
    return leftAxis.concat(rightAxis);

}