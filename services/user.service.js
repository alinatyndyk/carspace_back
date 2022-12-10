const {User} = require('../dataBase')

module.exports = {
    getAllUsers() {
        return User.find()
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