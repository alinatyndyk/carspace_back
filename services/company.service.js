const {Company} = require('../dataBase');

module.exports = {

    getAllCompanies(){
        return Company.find();
    },

    getCompanyById(id){
        return Company.findById(id);
    },

    getOneByParams(filter) {
        return Company.findOne(filter);
    },

    createCompany(companyObject){
        return Company.create(companyObject);
    },

    updateCompany(_id, newCompanyObject){
        return Company.findByIdAndUpdate(_id, newCompanyObject, {new: true});
    },

    deleteCompany(id){
        return Company.findByIdAndDelete(id);
    },
}