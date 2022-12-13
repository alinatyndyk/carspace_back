const {companyService} = require("../services");
const {ApiError} = require("../errors");
const {companyValidators} = require("../validators");

module.exports = {
    getCompanyDynamically: (from = 'params', fieldName = 'company_id', dbField = fieldName) => async (req, res, next) => {
        try {
            const fieldToSearch = req[from][fieldName];
            const company = await companyService.getOneByParams({[dbField]: fieldToSearch});

            if (!company) {
                return next(new ApiError('User is not found', 400));
            }
            req.company = company;

            next();

        } catch (e) {
            next(e)
        }
    },

    isCompanyPresent: (from = 'params') => async (req, res, next) => {
        try {
            const {company_id} = req[from];

            const company = await companyService.getCompanyById(company_id);

            if (!company) {
                return next(new ApiError('Company is not found', 400));
            }
            req.company = company;

            next();

        } catch (e) {
            next(e)
        }
    },

    uniqueCompanyNumber: async (req, res, next) => {
        try {
            const {contact_number} = req.body;
            const {company_id} = req.params;

            const company = await companyService.getOneByParams({contact_number, _id: {$ne: company_id}});

            if (company) {
                return next(new ApiError('This number is already in use', 400));
            }

            next();
        } catch (e) {
            next(e)
        }
    },

    companyBodyValid: (validatorType) => async (req, res, next) => {
        try {
            console.log(validatorType);
            const validate = companyValidators[validatorType].validate(req.body);

            if (validate.error) {
                return next(new ApiError(validate.error.message, 400))
            }

            next();
        } catch (e) {
            next(e)
        }
    },
}