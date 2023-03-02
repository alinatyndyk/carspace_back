const {tokenService, adminService} = require("../services");
const {ApiError} = require("../errors");
const {DELETE_USER, CREATE_USER} = require("../constants/email.action.enum");
const {sendEmail} = require("../services/email.service");

module.exports = {
    getAllAdmins: async (req, res, next) => {
        try {
            const users = await adminService.getAllAdmins()
            res.json(users)
        } catch (e) {
            next(e)
        }
    },

    getAdminById: async (req, res, next) => {
        try {
            const {admin_id} = req.params;
            const user = await adminService.getAdminById(admin_id);
            res.json(user)
        } catch (e) {
            next(e)
        }
    },

    createAdminVerify: async (req, res) => {
        const {email} = req.body;
        const verification_string = await tokenService.createVerificationString({});
        await sendEmail(email, CREATE_USER, {verification_string});
        res.json('The verification code was sent');
    },

    createAdmin: async (req, res) => {
        const hashPassword = await tokenService.hashPassword(req.body.password);
        const admin = adminService.createAdmin({...req.body, password: hashPassword});
        res.json({admin});
    },

    updateAdmin: async (req, res, next) => {
        try {
            const {_id} = req.tokenInfo.admin; //objectID
            const {admin_id} = req.params; //string

            if (admin_id !== _id.toString()) {
                return next(new ApiError('Access token doesnt belong to the admin you are trying to update'))
            }
            const user = await adminService.updateAdmin(admin_id, req.body);
            res.json(user)
        } catch (e) {
            next(e)
        }
    },

    deleteAdmin: async (req, res, next) => {
        try {
            const {admin_id} = req.params;
            const {_id, email, name} = req.tokenInfo.admin;

            if (admin_id !== _id.toString()) {
                return next(new ApiError('The access token doesnt belong to the admin you are trying to delete', 400));
            }

            await sendEmail(email, DELETE_USER, {userName: name});

            const user = await adminService.deleteAdmin(admin_id);
            res.json(user)
        } catch (e) {
            next(e)
        }
    },
}