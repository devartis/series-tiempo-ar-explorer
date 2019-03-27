export class Color {
    constructor(public name: string, public code: string){}
}

// "a<number>" is because order is important
const Colors = {
    a1Blue1: new Color("blue1", "#0072BB"),
    a2Green1: new Color("green1","#2E7D33"),
    a3Red: new Color("red", "#C62828"),
    a4Orange: new Color("orange", "#F9A822"),
    a5Violet: new Color("violet", "#6A1B99"),
    a6Pink: new Color("pink", "#EC407A"),
    a7Purple: new Color("purple", "#C2185B"),
    a8Blue2: new Color("blue2", "#039BE5"),
    a9Green2: new Color("green2", "#6EA100"),
};
export const NaC = new Color("", "");

export default Colors;

export function getColorBySerieId(serieId: string, colorForFn?: (serieId: string) => Color): string {
    return colorForFn ? colorForFn(serieId).code : '';
}
