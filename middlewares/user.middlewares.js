const {ApiError} = require("../errors");
const {userService} = require("../services");
const {userValidators} = require("../validators");

module.exports = {
    isUserPresent: (from = 'params') => async (req, res, next) => {
        try {
            const {user_id} = req[from];

            const user = await userService.getUserById(user_id);

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
            const {user_id} = req.params;

            const user = await userService.getOneByParams({email, _id: {$ne: user_id}});

            if (user) {
                return next(new ApiError('This email is already in use', 400));
            }

            next();

        } catch (e) {
            next(e)
        }
    },


    getUserDynamically: (from = 'body', fieldName = 'user_id', dbField = fieldName) => async (req, res, next) => {
        try {
            const fieldToSearch = req[from][fieldName];
            const user = await userService.getOneByParams({[dbField]: fieldToSearch});

            if (!user) {
                return next(new ApiError('User is not found', 400));
            }
            req.user = user;

            next();

        } catch (e) {
            next(e)
        }
    }
}