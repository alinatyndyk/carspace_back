const {ApiError} = require("../errors");
const {userService, tokenService, adminService} = require("../services");
const {userValidators} = require("../validators");
const {isAdminTokenValid} = require("./auth.middlewares");

module.exports = {
    isAdminPresent: (from = 'params') => async (req, res, next) => {
        try {
            const {admin_id} = req[from];

            const user = await adminService.getAdminById(admin_id);

            if (!user) {
                return next(new ApiError('User is not found', 400));
            }
            req.admin = user;

            next();

        } catch (e) {
            next(e)
        }
    },

    uniqueAdminEmail: async (req, res, next) => {
        try {
            const {email} = req.body;
            const {admin_id} = req.params;

            const user = await adminService.getOneByParams({email, _id: {$ne: admin_id}});

            if (user) {
                return next(new ApiError('This email is already in use', 400));
            }

            next();

        } catch (e) {
            next(e)
        }
    },


    getAdminDynamically: (from = 'body', fieldName = 'user_id', dbField = fieldName) => async (req, res, next) => {
        try {
            const fieldToSearch = req[from][fieldName];
            const user = await adminService.getOneByParams({[dbField]: fieldToSearch});

            if (!user) {
                return next(new ApiError('Admin is not found', 400));
            }
            req.admin = user;

            next();

        } catch (e) {
            next(e)
        }
    }
}