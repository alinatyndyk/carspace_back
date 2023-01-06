const {isObjectIdOrHexString} = require("mongoose");

const {ApiError} = require("../errors");
const {userValidators, commonValidators} = require("../validators");

module.exports = {
    validIdMldwr: (fieldName, from = 'params') => async (req, res, next) => {
        try {
            if (!isObjectIdOrHexString(req[from][fieldName])) {
                return next(new ApiError('Not valid Id', 400));
            }

            next();

        } catch (e) {
            next(e)
        }
    },

    isBodyValid: (validatorType) => async (req, res, next) => {
        try {
            console.log(validatorType);
            const validate = commonValidators[validatorType].validate(req.body);

            if (validate.error) {
                return next(new ApiError(validate.error.message, 400))
            }

            next();
        } catch (e) {
            next(e)
        }
    },
}