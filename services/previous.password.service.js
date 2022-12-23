const {PreviousPasswordUser} = require("../dataBase");
const {PreviousPasswordCompany} = require("../dataBase");


module.exports = {

    savePasswordInfo(oldPassInfo) {
        return PreviousPasswordUser.create(oldPassInfo)
    },

    savePasswordInfoCompany(oldPassInfo) {
        return PreviousPasswordCompany.create(oldPassInfo)
    },

    getByUserId(userId) {
        return PreviousPasswordUser.find({user: userId}).lean();
    },

    getByCompanyId(_id) {
        return PreviousPasswordCompany.find({company: _id}).lean();
    },

    deleteManyBeforeDate(date) {
        return PreviousPasswordUser.deleteMany({createdAt: {$lt: date}});
    }
}