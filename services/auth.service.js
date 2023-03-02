const {AuthCompany, AuthUser, AuthAdmin} = require('../dataBase')

module.exports = {
    saveTokensCompany(tokens) {
        return AuthCompany.create(tokens)
    },

    getOneWithCompany(filter) {
        return AuthCompany.findOne(filter).populate('company');
    },

    deleteOneCompanyByParams(filter) {
        return AuthCompany.deleteOne(filter);
    },

    deleteManyByParamsCompany(filter) {
        return AuthCompany.deleteMany(filter);
    },

    deleteManyByParamsAdmin(filter) {
        return AuthAdmin.deleteMany(filter);
    },

    getAllAuthCompany() {
        return AuthCompany.find();
    },

    saveTokensUser(tokens) {
        return AuthUser.create(tokens)
    },

    saveTokensAdmin(tokens) {
        return AuthAdmin.create(tokens);
    },

    getOneWithUser(filter) {
        return AuthUser.findOne(filter).populate('user');
    },

    getOneWithAdmin(filter) {
        return AuthAdmin.findOne(filter).populate('admin');
    },

    deleteOneUserByParams(filter) {
        return AuthUser.deleteOne(filter);
    },

    deleteOneAdminByParams(filter) {
        return AuthAdmin.deleteOne(filter);
    },

    getAllAuthUser() {
        return AuthUser.find();
    },

    deleteManyByParams(filter) {
        return AuthUser.deleteMany(filter);
    }
}