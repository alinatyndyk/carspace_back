const {PreviousPasswordUser} = require("../dataBase");


module.exports = {

    savePasswordInfo(oldPassInfo) {
        return PreviousPasswordUser.create(oldPassInfo)
    },

    getByUserId(userId) {
        return PreviousPasswordUser.findById({user: userId}).lean();
    },

    deleteManyBeforeDate(date) {
        return PreviousPasswordUser.deleteMany({createdAt: {$lt: date}});
    }
}