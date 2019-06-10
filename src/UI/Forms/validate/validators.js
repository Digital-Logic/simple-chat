import isEmailValidator from 'validator/lib/isEmail';

const isEqualTo = createValidator((value1, message = 'Passwords do not match') => {
    return memorize( function _isEqualTo(value2) {
        if (value1 !== value2) {
            return message;
        } else return '';
    });
});


const isNumber = createValidator((message = 'Invalid Number') => {
    return memorize(function _isNumber(value) {
        if (Number.isNaN( Number(value) )) {
            return message;
        } else return '';
    });
});

const minLength = createValidator((minValue, message = `Minimum of ${minValue} characters`) => {
    return memorize(function _minLength(value) {
        if (value == null) return '';
        if (String(value).length < minValue) {
            return message;
        } else return '';

    });
});

const maxLength = createValidator((maxValue, message = `${maxValue} characters max`) => {
    return memorize(function _maxLength(value) {
        if (value == null) return '';
        if (String(value).length > maxValue) {
            return message;
        } else return '';
    });
});

const isEmail = createValidator((message = `Please enter a valid eMail address.`) => {
    return memorize(function _isEmail(email) {
        if (isEmailValidator(email))
            return '';
        else return message;
    });
});


const required = createValidator((message = 'This field is required') => {
    return memorize(function _required(curValue) {
        if (curValue == null || (typeof curValue === 'string' && curValue.trim() === ''))
                return message;
            else return '';
    });
});


/**
 * Provides validator function caching to reduce re-rendering
 * @param {function} fn
 */
function createValidator(fn) {
    return memorize(fn);
}

function memorize(fn) {
    const cache = new Map();
    return function _memorizer(...args) {
        const key = JSON.stringify(args);
        if (!cache.has(key)) {
            cache.set(key, fn(...args));
        }
        return cache.get(key);
    }
}


// todo - isInteger, lessThan, greaterThan

export {
    required,
    isEqualTo,
    isNumber,
    minLength,
    maxLength,
    isEmail,
    createValidator,
    memorize
};