import isEmailValidator from 'validator/lib/isEmail';

function required(message = 'This field is required') {
    return buildValidator( function _required(curValue) {
        if (curValue == null || (typeof curValue === 'string' && curValue.trim() === '') )
            return message;
        else return '';
    }, true);
}

function isEqualTo(value1, message = 'Passwords do not match') {
    return buildValidator( function _isEqualTo(value2) {
        if (value1 !== value2) {
            return message;
        } else return '';
    });
}

function isNumber(message = 'Invalid Number') {
    return buildValidator(function _isNumber(value) {
        if (Number.isNaN( Number(value) )) {
            return message;
        } else return '';
    }, true);
}

function minLength (minValue, message = `Minimum of ${minValue} characters`) {
    return buildValidator(function _minLength(value) {
        if (value == null) return '';
        if (String(value).length < minValue) {
            return message;
        } else return '';

    }, true);
}

function maxLength (maxValue, message = `${maxValue} characters max`) {
    return buildValidator(function _maxLength(value) {
        if (value == null) return '';
        if (String(value).length > maxValue) {
            return message;
        } else return '';
    }, true);
}

function isEmail(message = `Please enter a valid eMail address.`) {
    return buildValidator(function _isEmail(email) {
        if (isEmailValidator(email))
            return '';
        else return message;
    }, true);
}

function buildValidator(validatorFn, isPure = false) {
    validatorFn.pure = isPure;

    return validatorFn;
}

// todo - isInteger, lessThan, greaterThan

export {
    required,
    isEqualTo,
    isNumber,
    minLength,
    maxLength,
    isEmail,
    buildValidator
};