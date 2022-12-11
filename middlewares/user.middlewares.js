const {ApiError} = require("../errors");
const {userService} = require("../services");
const {userValidators} = require("../validators");

module.exports = {
    isUserPresent: (from = 'params') => async (req, res, next) => {
        try {
            const {userId} = req[from];

            const user = await userService.getUserById(userId);

            if (!user) {
                return next(new ApiError('User is not found', 400));
            }
            req.user = user;

            next();

        } catch (e) {
            next(e)
        }
    },

    userBodyValid: (validatorType) => async (req, res, next) => {
        try {
            console.log(validatorType);
            const validate = userValidators[validatorType].validate(req.body);

            if (validate.error) {
                return next(new ApiError(validate.error.message, 400))
            }

            next();
        } catch (e) {
            next(e)
        }
    },

    uniqueUserEmail: async (req, res, next) => {
        try {
            const {email} = req.body;
            const {userId} = req.params;

            const user = await userService.getOneByParams({email, _id: {$ne: userId}});

            if (user) {
                return next(new ApiError('This email is already in use', 400));
            }

            next();

        } catch (e) {
            next(e)
        }
    },
}