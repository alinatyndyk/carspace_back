const {carValidators} = require("../validators");
const {ApiError} = require("../errors");

module.exports = {
    carBodyValid: (validatorType) => async (req, res, next) => {
        try {
            console.log(validatorType);
            const validate = carValidators[validatorType].validate(req.body);

            if (validate.error) {
                return next(new ApiError(validate.error.message, 400))
            }

            next();
        } catch (e) {
            next(e)
        }
    },
}