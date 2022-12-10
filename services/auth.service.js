const {Auth} = require('../dataBase')

module.exports = {
    saveTokens(tokens) {
        return Auth.create(tokens)
    },

    getOneWithCompany(filter){
        return Auth.findOne(filter).populate('company'); // TODO populate company
    },

    getAllAuth(filter = {}){
        return Auth.find(filter)
    }
}