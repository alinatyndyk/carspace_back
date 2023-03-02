const {Admin} = require('../dataBase')

module.exports = {
    getAllAdmins() {
        return Admin.find()
    },

    getAdminById(_id) {
        return Admin.findById(_id)
    },

    getOneByParams(filter) {
        return Admin.findOne(filter);
    },

    createAdmin(userObject) {
        return Admin.create(userObject);
    },

    updateAdmin(_id, userObject) {
        return Admin.findByIdAndUpdate(_id, userObject, {new: true})
    },

    deleteAdmin(_id) {
        return Admin.findByIdAndDelete(_id)
    },

    deleteAdmins(filter={}) {
        return Admin.deleteMany(filter)
    },
}