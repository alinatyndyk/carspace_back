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

    createUser(object) {
        return User.create(object);
    },

    updateUser(_id, userObject) {
        return User.findByIdAndUpdate(_id, userObject, {new: true})
    },

    deleteUser(_id) {
        return User.findByIdAndDelete(_id)
    },

    deleteUsers(filter={}) {
        return User.deleteMany(filter)
    },
}