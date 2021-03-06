import { IPublisher, ITSMeta } from "./ITSAPIResponse";
import { ISerie, DEFAULT_SIGNIFICANT_FIGURES } from "./Serie";
import {PeriodicityManager} from "./utils/periodicityManager";


const DEFAULT_HITS_90_DAYS: number = 0;

export default class SearchResult implements ISerie {

    private periodicityParser: PeriodicityManager;

    constructor(private searchResult: ITSMeta) {
        this.periodicityParser = new PeriodicityManager(this.searchResult.field.frequency);
    }

    public get id(): string {
        return this.searchResult.field.id;
    }

    public get title(): string {
        return this.searchResult.field.description;
    }

    public get publisher(): IPublisher {
        return this.searchResult.dataset.publisher;
    }

    public get description(): string {
        return this.searchResult.dataset.title;
    }

    public get data() {
        return [];
    }

    public get accrualPeriodicity() {
        return this.fieldPeriodicity;
    }

    public get startDate() {
        return this.searchResult.field.time_index_start;
    }

    public get endDate() {
        return this.searchResult.field.time_index_end;
    }

    public get units() {
        return this.searchResult.field.units;
    }

    public get landingPage() {
        return "";
    }

    public get issued() {
        return "";
    }

    public get themes() {
        return [];
    }

    public get modified() {
        return "";
    }

    public get datasetSource() {
        return this.searchResult.dataset.source;
    }

    public get fieldPeriodicity() {
        return this.periodicityParser.formattedPeriodicity();
    }

    public get timeIndexSize() {
        return this.searchResult.field.time_index_size;
    }

    public get distributionTitle() {
        return '';
    }

    public get datasetTitle() {
        return '';
    }

    get representationModeUnits() {
        return '';
    }

    get downloadURL() {
        return '';
    }

    get minValue() { return 0; }
    get maxValue() { return 0; }

    get representationMode(): string {
        return "";
    }

    get collapseAggregation(): string {
        return "";
    }

    get isPercentage(): boolean {
        return false;
    }

    get significantFigures(): number {
        return DEFAULT_SIGNIFICANT_FIGURES;
    }

    get hits90Days(): number {
        return this.searchResult.field.hits_90_days || DEFAULT_HITS_90_DAYS;
    }

}
