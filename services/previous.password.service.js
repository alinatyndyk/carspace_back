const {PreviousPasswordUser, PreviousPasswordAdmin} = require("../dataBase");
const {PreviousPasswordCompany} = require("../dataBase");


module.exports = {

    savePasswordInfo(oldPassInfo) {
        return PreviousPasswordUser.create(oldPassInfo)
    },

    savePasswordInfoAdmin(oldPassInfo) {
        return PreviousPasswordAdmin.create(oldPassInfo)
    },

    savePasswordInfoCompany(oldPassInfo) {
        return PreviousPasswordCompany.create(oldPassInfo)
    },

    getByUserId(userId) {
        return PreviousPasswordUser.find({user: userId}).lean();
    },

    getByAdminId(adminId) {
        return PreviousPasswordAdmin.find({admin: adminId}).lean();
    },

    getByCompanyId(_id) {
        return PreviousPasswordCompany.find({company: _id}).lean();
    },

    deleteManyBeforeDate(date) {
        return PreviousPasswordUser.deleteMany({createdAt: {$lt: date}});
    }
}