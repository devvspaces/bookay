// Load states and capitals


import stateLGAs from "./states_and_lga";


export const states = Object.keys(stateLGAs);

export const LGAs: string[] = [];

Object.keys(stateLGAs).forEach((state) => {
    LGAs.push(...stateLGAs[state]);
});

export const getLGA = (state: string) => {
    return stateLGAs[state];
}
