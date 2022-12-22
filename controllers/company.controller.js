const {companyService, tokenService} = require("../services");
const {ApiError} = require("../errors");
const {sendEmail} = require("../services/email.service");
const {COMPANY_CREATE} = require("../constants/email.action.enum");
module.exports = {
    getAllCompanies: async (req, res, next) => {
        try {
            const companies = await companyService.getAllCompanies();
            res.json(companies);
        } catch (e) {
            next(e);
        }
    },

    getCompanyById: async (req, res, next) => {
        try {
            const {company_id} = req.params;
            const companies = await companyService.getCompanyById(company_id);
            res.json(companies);
        } catch (e) {
            next(e);
        }
    },

    createCompany: async (req, res, next) => {
        try {
            const {email, name} = req.body;
            const hashPassword = await tokenService.hashPassword(req.body.password);
            await sendEmail(email, COMPANY_CREATE, {companyName: name});
            const company = await companyService.createCompany({...req.body, password: hashPassword});
            res.json(company);
        } catch (e) {
            next(e);
        }
    },

    updateCompany: async (req, res, next) => {
        try {
            const {_id} = req.tokenInfo.company;
            const {company_id} = req.params;

            const companyIdString = _id.toString();

            if (company_id !== companyIdString) {
                return next(new ApiError('Access token doesnt belong to the company you are trying to update'))
            }

            const company = await companyService.updateCompany(company_id, req.body);
            res.json(company);
        } catch (e) {
            next(e);
        }
    },

    deleteCompany: async (req, res, next) => {
        try {
            const {company_id} = req.params;
            console.log(req.params);
            const company = await companyService.deleteCompany(company_id);
            res.json(company);
        } catch (e) {
            next(e);
        }
    },
}