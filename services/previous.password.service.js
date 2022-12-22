const {PreviousPasswordUser, PreviousPasswordCompany} = require("../dataBase");


module.exports = {

    savePasswordInfoUser(oldPassInfo) {
        return PreviousPasswordUser.create(oldPassInfo)
    },

    getByUserId(userId) {
        return PreviousPasswordUser.find({user: userId}).lean();
    },

    // savePasswordInfoCompany(oldPassInfo) {
    //     return PreviousPasswordCompany.create(oldPassInfo)
    // },
    //
    // getByCompanyId(userId) {
    //     return PreviousPasswordCompany.find({user: userId}).lean();
    // },

    deleteManyBeforeDate(date) {
        return PreviousPasswordCompany.deleteMany({createdAt: {$lt: date}});
    }, //todo cron job
}