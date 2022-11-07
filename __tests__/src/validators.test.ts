import { required } from "../../src/validators";


describe('test required validator', () => {
    it('should return error message', () => {
        expect(required('')).toBe('This field is required');
    });

    it('should return undefined', () => {
        expect(required('test')).toBeUndefined();
    });
});