import { required, isEqualTo, isNumber, minLength, maxLength } from '../index';

describe('Testing validators', () => {

    it('required validates', () => {
        const fieldRequired = required();
        expect(fieldRequired(null)).toEqual('This field is required');
        expect(fieldRequired('')).toEqual('This field is required');
        expect(fieldRequired('asd')).toBe('');
    });

    it('isEqualTo', () => {
        const equalTo = isEqualTo('a', 'Error');
        expect(equalTo('')).toEqual('Error');
        expect(equalTo(null)).toEqual('Error');
        expect(equalTo(1)).toEqual('Error');
        expect(equalTo('a')).toEqual('');
    });

    it('isNumber', () => {
        const number = isNumber();
        expect(number('a')).toBe('Invalid Number');
        expect(number('')).toBe(''); // blank string converts to 0
        expect(number('2')).toBe('');
        expect(number(2)).toBe('');
    });

    it('minLength', ()=>{
        const twoOrMore = minLength(2,'error');
        expect(twoOrMore('')).toBe('error');
        expect(twoOrMore('as')).toBe('');
        expect(twoOrMore('a')).toBe('error');
        expect(twoOrMore(2)).toBe('error');
        expect(twoOrMore(22)).toBe('');
        expect(twoOrMore(undefined)).toBe('');
    });

    it('maxLength', () => {
        const lessThan = maxLength(3, 'error');
        expect(lessThan('asc')).toBe('');
        expect(lessThan('ascd')).toBe('error');
        expect(lessThan(123)).toBe('');
        expect(lessThan(1234)).toBe('error');
        expect(lessThan(null)).toBe('');
    })
});