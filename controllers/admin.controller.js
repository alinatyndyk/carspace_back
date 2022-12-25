const {userService, tokenService, adminService} = require("../services");
const {ApiError} = require("../errors");
const {WELCOME, DELETE_USER, CREATE_USER} = require("../constants/email.action.enum");
const {sendEmail} = require("../services/email.service");

module.exports = {
    getAllAdmins: async (req, res, next) => {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (e) {
            next(e);
        }
    },

    getAdminById: async (req, res, next) => {
        try {
            const {admin_id} = req.params;
            const admin = await adminService.getAdminById(admin_id);
            res.json(admin);
        } catch (e) {
            next(e);
        }
    },

    createAdmin: async (req, res, next) => {
        try {
            const hashPassword = await tokenService.hashPassword(req.body.password)
            const createdAdmin = await adminService.createAdmin({...req.body, password: hashPassword});

            res.json(createdAdmin);
        } catch (e) {
            next(e);
        }
    },

    updateAdmin: async (req, res, next) => {
        try {
            const {_id} = req.tokenInfo.admin; //objectID
            const {admin_id} = req.params; //string

            if (admin_id !== _id.toString()) {
                return next(new ApiError('Access token doesnt belong to the admin you are trying to update'))
            }

            const user = await userService.updateUser(user_id, req.body);
            res.json(user)
        } catch (e) {
            next(e)
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const {user_id} = req.params;
            const {_id, email, name} = req.tokenInfo.user;

            if (user_id !== _id.toString()) {
                return next(new ApiError('The access token doesnt belong to the user you are trying to delete', 400));
            }

            await sendEmail(email, DELETE_USER, {userName: name});

            const user = await userService.deleteUser(user_id);
            res.json(user)
        } catch (e) {
            next(e)
        }
    },

    //todo delete admin code
}