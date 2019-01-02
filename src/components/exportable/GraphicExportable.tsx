import * as React from "react";
import {ApiClient} from "../../api/ApiClient";
import QueryParams from "../../api/QueryParams";
import {ISerie} from "../../api/Serie";
import SerieApi from "../../api/SerieApi";
import {valuesFromObject} from "../../helpers/commonFunctions";
import {Color} from "../style/Colors/Color";
import Graphic from "../viewpage/graphic/Graphic";
import {chartExtremes} from "../viewpage/graphic/GraphicAndShare";
import {seriesConfigByUrl} from "../viewpage/ViewPage";


const Colors = {
    aBlue: new Color("blue", "#0072BB"),
    bGreen: new Color("green","#2E7D33"),
    cRed: new Color("red", "#C62828"),
    dOrange: new Color("orange", "#F9A822"),
    eViolet: new Color("violet", "#6A1B99"),
};


export interface IGraphicExportableProps {
    graphicUrl: string;
    chartOptions: any;
    navigator?: boolean;
    locale: string;
    zoom?: boolean;
    exportable?: boolean;
    colors?: string[];
    backgroundColor?: string;
}

interface IGraphicExportableState {
    series: ISerie[];
    dateRange: { start: string, end: string };
}

export default class GraphicExportable extends React.Component<IGraphicExportableProps, IGraphicExportableState> {

    private seriesApi: SerieApi;

    public constructor(props: any) {
        super(props);
        this.colorFor = this.colorFor.bind(this);

        this.seriesApi = new SerieApi(new ApiClient(extractUriFromUrl(props.graphicUrl)));
        this.state = {
            dateRange: { start: '', end: '' },
            series: []
        }
    }

    public componentDidMount() {
        const url = new URLSearchParams(this.props.graphicUrl);
        const ids = extractIdsFromUrl(this.props.graphicUrl);
        const params = new QueryParams(ids);

        const start = url.get('start_date') || '';
        const end = url.get('end_date') || '';

        if (this.props.navigator) {
            url.delete('start_date');
            url.delete('end_date');
        } else {
            params.setStartDate(start);
            params.setEndDate(end);
        }

        this.setState({dateRange: {start, end}});
        params.addParamsFrom(url);
        this.fetchSeries(params);
    }

    public render() {
        const chartOptions = buildChartOptions(this.props.chartOptions, this.props);

        return (
            <Graphic series={this.state.series}
                     range={chartExtremes(this.state.series, this.state.dateRange)}
                     seriesConfig={seriesConfigByUrl(this.state.series, this.props.graphicUrl)}
                     chartOptions={chartOptions}
                     colorFor={this.colorFor}
                     formatUnits={true}
                     locale={this.props.locale} />
        )
    }

    private colorFor(serieId: string): Color {
        const colors = this.props.colors ? buildColors(this.props.colors) : valuesFromObject(Colors);
        const index = this.state.series.findIndex(viewSerie => viewSerie.id === serieId) % colors.length;

        return colors[index];
    }

    private fetchSeries(params: QueryParams) {
        this.seriesApi.fetchSeries(params)
            .then((series: ISerie[]) => this.setState({series}))
            .catch(alert);
    }

}

function extractIdsFromUrl(url: string): string[] {
    return url.split('ids=')[1].split('&')[0].split(',')
}

function extractUriFromUrl(url: string): string {
    return url.split('series/?')[0];
}

function buildChartOptions(chartOptions: any, componentProps: IGraphicExportableProps): any {
    const options = chartOptions;
    options.navigator = Object.assign({}, options.navigator, { enabled: componentProps.navigator });
    options.scrollbar = Object.assign({}, options.scrollbar, { enabled: componentProps.navigator });
    options.exporting = Object.assign({}, options.exporting, { enabled: componentProps.exportable });
    options.chart = Object.assign({}, options.chart, {
        backgroundColor: componentProps.backgroundColor ? componentProps.backgroundColor : '#ffffff00',
        zoomType: componentProps.zoom ? 'x' : ''
    });
    options.rangeSelector = Object.assign({}, options.rangeSelector, { enabled: componentProps.zoom });

    return options;
}

function buildColors(colors: string[]): Color[] {
    return colors.map((color: string) => new Color('customColor', color));
}