const {AuthCompany, AuthUser} = require('../dataBase')

module.exports = {
    saveTokensCompany(tokens) {
        return AuthCompany.create(tokens)
    },

    getOneWithCompany(filter) {
        return AuthCompany.findOne(filter).populate('company');
    },

    getOneCompanyByParams(filter) {
        return AuthCompany.findOne(filter);
    },

    getAllCompanyAuth(filter = {}) {
        return AuthCompany.find(filter)
    },

    deleteOneCompanyByParams(filter) {
        return AuthCompany.deleteOne(filter);
    },

    getAllAuthCompany() {
        return AuthCompany.find();
    },
    //-------------------------------------------------------------------------------------

    saveTokensUser(tokens) {
        return AuthUser.create(tokens)
    },

    getOneWithUser(filter) {
        return AuthUser.findOne(filter).populate('user');
    },

    getOneUserByParams(filter) {
        return AuthUser.findOne(filter);
    },

    getAllUserAuth(filter = {}) {
        return AuthUser.find(filter)
    },

    deleteOneUserByParams(filter) {
        return AuthUser.deleteOne(filter);
    },

    getAllAuthUser() {
        return AuthUser.find();
    },
}