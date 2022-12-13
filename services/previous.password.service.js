const {PreviousPassword} = require("../dataBase");


module.exports = {

    savePasswordInfo(oldPassInfo) {
        return PreviousPassword.create(oldPassInfo)
    },

    getByUserId(userId) {
        return PreviousPassword.findById({user: userId}).lean();
    },

    deleteManyBeforeDate(date) {
        return PreviousPassword.deleteMany({createdAt: {$lt: date}});
    }
}