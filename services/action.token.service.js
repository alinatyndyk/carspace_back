const {ActionTokens} = require('../dataBase')

module.exports = {
    createActionToken(dataToInsert) {
        return ActionTokens.create(dataToInsert);
    },

    getOneBySearchParamsWithUser: (searchParams) => {
        return ActionTokens.findOne(searchParams).populate('user');
    },

    getOneBySearchParamsWithAdmin: (searchParams) => {
        return ActionTokens.findOne(searchParams).populate('admin');
    },

    getOneBySearchParamsWithCompany: (searchParams) => {
        return ActionTokens.findOne(searchParams).populate('company');
    },

    deleteActionToken: (deleteParams) => {
        return ActionTokens.deleteMany(deleteParams);
    }
}