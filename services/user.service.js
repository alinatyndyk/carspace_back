const {User} = require('../dataBase')

module.exports = {
    getAllUsers() {
        return User.find()
    },

    getUserById(_id) {
        return User.findById(_id)
    },

    getOneByParams(filter) {
        return User.findOne(filter);
    },

    createUser(userObject) {
        return User.create(userObject)
    },

    updateUser(_id, userObject) {
        return User.findByIdAndUpdate(_id, userObject)
    },

    deleteUser(_id) {
        return User.findByIdAndDelete(_id)
    },
}