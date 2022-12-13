const {ActionTokens} = require('../dataBase')

module.exports = {
    createActionToken(dataToInsert) {
        return ActionTokens.find(dataToInsert);
    },

    getOneBySearchParamsWithUser: (searchParams) => {
        return ActionTokens.findOne(searchParams).populate('user');
    },

    deleteActionToken: (deleteParams) => {
        return ActionTokens.deleteMany(deleteParams);
    }
}