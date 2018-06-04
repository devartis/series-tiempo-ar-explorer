import { ISerie } from "../api/Serie";
import { ISerieApi } from "../api/SerieApi";
import { ISearchParams } from "../components/searchpage/searcher/Searcher";

export interface IStore {
    featured: ISerie[],
    viewSeries: ISerie[],
    seriesApi: ISerieApi | null,
    searchParams: ISearchParams,
}

const initialState: IStore = {
    featured: [],
    searchParams: {
        datasetSource: "",
        limit: 10,
        offset: 0,
        q: "",
    },
    seriesApi: null,
    viewSeries: [],
}

export default initialState;
