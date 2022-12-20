const {userService, tokenService} = require("../services");
const {ApiError} = require("../errors");
const {WELCOME} = require("../constants/email.action.enum");
const {sendEmail} = require("../services/email.service");

module.exports = {
    getAllUsers: async (req, res, next) => {
        try {
            const users = await userService.getAllUsers()
            res.json(users)
        } catch (e) {
            next(e)
        }
    },

    getUserById: async (req, res, next) => {
        try {
            const {user_id} = req.params;
            const user = await userService.getUserById(user_id);
            res.json(user)
        } catch (e) {
            next(e)
        }
    },

    createUser: async (req, res, next) => {
        try {
            const {email, name} = req.body;
            const hashPassword = await tokenService.hashPassword(req.body.password)
            const createdUser = await userService.createUser({...req.body, password: hashPassword});

            await sendEmail(email, WELCOME, {userName: name});

            res.json(createdUser);
        } catch (e) {
            next(e)
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const {_id} = req.tokenInfo.user; //objectID
            const {user_id} = req.params; //string

            if (user_id !== _id.toString()) {
                return next(new ApiError('Access token doesnt belong to the user you are trying to update'))
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
            const {_id} = req.tokenInfo.user;

            if (user_id !== _id.toString()) {
                return next(new ApiError('The access token doesnt belong to the user you are trying to delete', 400));
            }

            const user = await userService.deleteUser(user_id);
            res.json(user)
        } catch (e) {
            next(e)
        }
    },
}