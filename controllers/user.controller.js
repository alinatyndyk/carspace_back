const {userService} = require("../services");
module.exports = {
    getAllUsers: async (req, res, next) => {
        try {
            const users = await userService.getAllUsers()
            res.json(users)
        } catch (e) {
            next(e)
        }
    },

    createUser: async (req, res, next) => {
        try {
            const user = await userService.createUser(req.body);
            res.json(user)
        } catch (e) {
            next(e)
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const {user_id} = req.params;
            const user = await userService.updateUser(user_id, req.body);
            res.json(user)
        } catch (e) {
            next(e)
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const {user_id} = req.params;
            const user = await userService.deleteUser(user_id);
            res.json(user)
        } catch (e) {
            next(e)
        }
    },
}