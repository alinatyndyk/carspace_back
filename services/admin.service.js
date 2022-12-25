const {Admin} = require('../dataBase') //todo admin

module.exports = {
    getAllUsers() {
        return User.find()
    },

    getAdminById(_id) {
        return Admin.findById(_id)
    },

    getOneByParams(filter) {
        return Admin.findOne(filter);
    },

    createAdmin(adminObject) {
        return Admin.create(adminObject)
    },

    updateUser(_id, userObject) {
        return User.findByIdAndUpdate(_id, userObject, {new: true})
    },

    deleteUser(_id) {
        return User.findByIdAndDelete(_id)
    },
}