import { capitalize, getDate } from "../../src/utils";

describe("test capitalize function", () => {
    it("should capitalize the first letter of the string", () => {
        expect(capitalize("test")).toBe("Test");
    });

    it("should return the same string if the first letter is already capitalized", () => {
        expect(capitalize("Test")).toBe("Test");
    });
});


describe("test getDate function", () => {
    it("should return the current date in the format of 'day month year'", () => {
        const date = getDate();
        const dateRegex = /^\w+ \d{1,2}, \d{4}$/;
        expect(dateRegex.test(date)).toBe(true);
    });
});

