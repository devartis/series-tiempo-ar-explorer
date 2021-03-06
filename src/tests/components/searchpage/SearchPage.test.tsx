import { configure, mount } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Store } from 'redux';
import { setSeriesApi } from '../../../actions/seriesActions';
import { ISerieApi } from '../../../api/SerieApi';
import SearchPage from '../../../components/searchpage/SearchPage';
import configureStore from '../../../store/configureStore';
import MockApi from '../../api/mockApi';


window.scrollTo = () => { return } // Mute error "Not implemented: window.scrollTo"

configure({ adapter: new Adapter() });

describe("SearchPage", () => {
    let mockSeriesApi: ISerieApi;
    let store: Store;
    let datasetSource: string;
    let datasetTheme: string;
    let publisher: string;
    let units: string;
    let catalogId: string;
    let sort: string;
    let sortBy: string;

    beforeEach(() => {
        mockSeriesApi = new MockApi(0);
        mockSeriesApi.searchSeries = jest.fn().mockImplementation(mockSeriesApi.searchSeries);
        mockSeriesApi.fetchSeries = jest.fn().mockImplementation(mockSeriesApi.fetchSeries);

        store = configureStore();
        store.dispatch(setSeriesApi(mockSeriesApi));

        datasetSource = "";
        datasetTheme = "";
        publisher = "";
        units = "";
        catalogId = "";
        sort = "";
        sortBy = "";
    });

    it('renders without crashing', () => {
        const div = document.createElement('div');

        ReactDOM.render(
            <MemoryRouter initialEntries={['/search/?q=cons']} initialIndex={0}>
                <Provider store={store}>
                    <SearchPage seriesApi={new MockApi(0)} 
                                heroImageUrl="myHero.jpg"
                                locale={"AR"} />
                </Provider>
            </MemoryRouter>
        , div);
        ReactDOM.unmountComponentAtNode(div);
    });

    it('gets search results from seriesApi', () => {
        const searchterm = "exportaciones"

        mount(
            <MemoryRouter initialEntries={['/search/?q=' + searchterm]}
                            initialIndex={0} >
                <Provider store={store}>
                    <SearchPage seriesApi={mockSeriesApi} 
                                heroImageUrl="myHero.jpg"
                                locale={"AR"} />
                </Provider>
            </MemoryRouter>
        );

        expect(mockSeriesApi.searchSeries).toHaveBeenCalledWith(searchterm, { catalogId, datasetTheme, datasetSource, offset: 0, limit: 10, aggregations: true, publisher, sort, sortBy, units });
    });

    it('gets search results from seriesApi with limit and offset parameters', () => {
        const searchterm = "exportaciones"
        const offset = 10;
        const limit = 5;

        mount(
            <MemoryRouter initialEntries={[`/search/?offset=${offset}&limit=${limit}&q=${searchterm}`]}
                            initialIndex={0}>
                    <Provider store={store}>
                        <SearchPage seriesApi={mockSeriesApi} 
                                    heroImageUrl="myHero.jpg"
                                    locale={"AR"} />
                    </Provider>
            </MemoryRouter>
        );

        expect(mockSeriesApi.searchSeries).toHaveBeenCalledWith(searchterm, { catalogId, datasetTheme, datasetSource, offset, limit, aggregations: true, publisher, sort, sortBy, units });
    });
});
