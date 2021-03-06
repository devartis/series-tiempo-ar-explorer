import { GraphicURLValidator } from "../../../helpers/graphic/URLValidation";

describe("URL Validation for the Graphic exportable component", () => {

    let url: string;
    let validator: GraphicURLValidator;

    beforeAll(() => {
        validator = new GraphicURLValidator();
    })

    describe("URLs with wrong endpoints", () => {

        it("Missing the /api endpoint substring makes it an invalid URL", () => {
            url = "https://apis.datos.gob.ar/series?ids=116.4_TCRZE_2015_D_34";
            expect(validator.isValidURL(url)).toBe(false);
        });
        it("Missing the /series endpoint substring makes it an invalid URL", () => {
            url = "https://apis.datos.gob.ar/api?ids=116.4_TCRZE_2015_D_34";
            expect(validator.isValidURL(url)).toBe(false);
        });
        it("Having the /api endpoint after the /series one makes it an invalid URL", () => {
            url = "https://apis.datos.gob.ar/series/api?ids=116.4_TCRZE_2015_D_34";
            expect(validator.isValidURL(url)).toBe(false);
        });

    })

    it("The URI root does not matter, as long as it has both endpoints in order", () => {
        url = "https://apis.mydata.com/series/api?ids=116.4_TCRZE_2015_D_34";
        expect(validator.isValidURL(url)).toBe(false);
    });
    it("Missing the param starter question mark makes it an invalid URL", () => {
        url = "https://apis.datos.gob.ar/series/api/series/ids=143.3_NO_PR_2004_A_21&limit=1000&collapse=month";
        expect(validator.isValidURL(url)).toBe(false);
    });

    describe("URLs with wrong use of the ids query param", () => {
        
        it("Missing the ids param makes it an invalid URL", () => {
            url = "https://apis.datos.gob.ar/series/api/series/?limit=1000&collapse=month";
            expect(validator.isValidURL(url)).toBe(false);
        });
        it("Having the ids param but missing its value makes it an invalid URL", () => {
            url = "https://apis.datos.gob.ar/series/api/series/?ids=&limit=1000&collapse=month";
            expect(validator.isValidURL(url)).toBe(false);
        });
        it("Missing the conjunction operator for the ids param makes it an invalid URL", () => {
            url = "https://apis.datos.gob.ar/series/api/series/?collapse=yearids=116.4_TCRZE_2015_D_36_4";
            expect(validator.isValidURL(url)).toBe(false);
        });

    })

    describe("URLs with right use of the ids query param, but wrong use of the other params", () => {

        it("Key-less query param makes it an invalid URL", () => {
            url = "https://apis.datos.gob.ar/series/api/series?l=1&ids=116.4_TCRZE_2015_D_36_4&=1000";
            expect(validator.isValidURL(url)).toBe(false);
        });
        it("Value-less query param makes it an invalid URL", () => {
            url = "https://apis.datos.gob.ar/series/api/series?l=1&ids=116.4_TCRZE_2015_D_36_4&l=";
            expect(validator.isValidURL(url)).toBe(false);
        });

    })

    describe("Well-written URLs and their flexibility", () => {

        it("Having the optional slash before the param starter makes it a valid URL", () => {
            url = "https://apis.datos.gob.ar/series/api/series/?ids=143.3_NO_PR_2004_A_21:percent_change_a_year_ago";
            expect(validator.isValidURL(url)).toBe(true);
        });
        it("Missing the optional slash before the param starter makes it a valid URL as well", () => {
            url = "https://apis.datos.gob.ar/series/api/series?ids=116.4_TCRZE_2015_D_36_4";
            expect(validator.isValidURL(url)).toBe(true);
        });
        it("Having multiple ids at the param makes it a valid URL", () => {
            url = "https://apis.datos.gob.ar/series/api/series/?ids=143.3_NO_PR_2004_A_21,116.4_TCRZE_2015_D_36_4";
            expect(validator.isValidURL(url)).toBe(true);
        });
        it("Having optional params well-written makes it a valid URL", () => {
            url = "https://apis.datos.gob.ar/series/api/series/?ids=143.3_NO_PR_2004_A_21&collapse=month&limit=1000";
            expect(validator.isValidURL(url)).toBe(true);
        });
        it("Optional query params may have dashes at both their keys or values", () => {
            url = "https://apis.datos.gob.ar/series/api/series/?collapse=month&collapse_aggregation=avg&ids=168.1_T_CAMBIOR_D_0_0_26&limit=5000&start_date=2017-02-01";
            expect(validator.isValidURL(url)).toBe(true);
        });
        it("Having the ids param not as first param still makes it a valid URL", () => {
            url = "https://apis.datos.gob.ar/series/api/series/?collapse=month&limit=1000&ids=116.4_TCRZE_2015_D_36_4";
            expect(validator.isValidURL(url)).toBe(true);
        });
        it("Having the ids param between other params still makes it a valid URL", () => {
            url = "https://apis.datos.gob.ar/series/api/series/?collapse=month&ids=143.3_NO_PR_2004_A_21:percent_change_a_year_ago&limit=1000";
            expect(validator.isValidURL(url)).toBe(true);
        });

    })

})