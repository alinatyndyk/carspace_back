const {Router} = require('express');

const {companyController} = require("../controllers");
const {companyMldwr, commonMldwr, authMldwr} = require("../middlewares");

const companyRouter = Router();

companyRouter.get('/',
    companyController.getAllCompanies); // everyone

companyRouter.get('/:company_id',
    commonMldwr.validIdMldwr('company_id', 'params'),
    companyMldwr.isCompanyPresent(),
    companyController.getCompanyById); // everyone

companyRouter.post('/',
    //access admin
    companyMldwr.companyBodyValid('newCompanyValidator'),
    companyMldwr.uniqueCompanyNumber,
    companyController.createCompany); //only admin

companyRouter.patch('/:company_id',
    commonMldwr.validIdMldwr('company_id', 'params'),
    authMldwr.isAccessTokenValidCompany,
    companyMldwr.companyBodyValid('updateCompanyValidator'),
    companyController.updateCompany); //only a company with the same id --done

companyRouter.delete('/:company_id',
    commonMldwr.validIdMldwr('company_id', 'params'),
    //access admin
    companyController.deleteCompany); //only admin

module.exports = companyRouter;