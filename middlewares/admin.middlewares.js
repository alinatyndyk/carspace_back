const {adminService} = require("../services");
const {ApiError} = require("../errors");

module.exports = {
    getAdminDynamically: (from = 'body', fieldName = 'admin_id', dbField = fieldName) => async (req, res, next) => {
        try {
            const fieldToSearch = req[from][fieldName];
            const admin = await adminService.getOneByParams({[dbField]: fieldToSearch});

            if (!admin) {
                return next(new ApiError('Admin is not found', 400));
            }
            req.admin = admin;

            next();

        } catch (e) {
            next(e)
        }
    },

    adminBodyValid: (validatorType) => async (req, res, next) => {
        try {
            console.log(validatorType);
            const validate = companyValidators[validatorType].validate(req.body);

            if (validate.error) {
                return next(new ApiError(validate.error.message, 400))
            }

            next();
        } catch (e) {
            next(e)
        }
    },
}