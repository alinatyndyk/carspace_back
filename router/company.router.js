const {Router} = require('express');

const {companyController} = require("../controllers");
const {commonValidators} = require("../validators");
const {companyMldwr, authMldwr} = require("../middlewares");

const companyRouter = Router();

companyRouter.get('/',

    companyController.getAllCompanies); // only admin

companyRouter.get('/:company_id',
    commonValidators.validIdMldwr('company_id', 'params'),
    companyMldwr.isCompanyPresent(),
    companyController.getCompanyById); //only admin

companyRouter.post('/',
    //access admin
    companyMldwr.companyBodyValid('newCompanyValidator'),
    companyMldwr.uniqueCompanyNumber,
    companyController.createCompany); //only admin

companyRouter.patch('/:company_id',
    commonValidators.validIdMldwr('company_id', 'params'),
    authMldwr.isAccessTokenValid,
    companyMldwr.companyBodyValid('updateCompanyValidator'),
    companyController.updateCompany); //only a company with the same id

companyRouter.delete('/:company_id', companyController.deleteCompany); //only admin

module.exports = companyRouter;