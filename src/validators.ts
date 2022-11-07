import { getLGA } from "./states/states";

export function required(value: string) {
    if (value === '') {
        return 'This field is required';
    }
}


export function validLgaToState(state: string, lga: string) {
    const stateLGAs = getLGA(state);
    if (stateLGAs.indexOf(lga) === -1) {
        return 'Invalid LGA for selected state';
    }
}