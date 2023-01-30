const {companyService, tokenService} = require("../services");
const {ApiError} = require("../errors");
const {sendEmail} = require("../services/email.service");
const {COMPANY_CREATE} = require("../constants/email.action.enum");
const {Company} = require("../dataBase");
const {Error} = require("mongoose");
const multer = require("multer");
const {companyValidators} = require("../validators");
const storage = multer.diskStorage({
    destination: 'Images',
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname);
    }
})
const upload = multer({storage: storage}).single('testImage');


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

    createCompanyImg: async (req, res, next) => {
            upload(req, res, async () => {
                const validate = companyValidators.newCompanyValidator.validate(req.body);

                if (validate.error) {
                    return next(new ApiError(validate.error.message, 400))
                }
                const {email, name, contact_number} = req.body;

                const company = await companyService.getOneByParams({contact_number});

                if (company) {
                    return next(new ApiError('This number is already in use', 400));
                }

                const hashPassword = await tokenService.hashPassword(req.body.password);
                await sendEmail(email, COMPANY_CREATE, {companyName: name});
                if (!req.file) {
                    return next(new ApiError('Upload at least one picture', 400))
                } else {
                    const newCompany = new Company({
                        ...req.body,
                        password: hashPassword,
                        image: {
                            data: req.file.filename,
                            link: `http://localhost:5000/photos/${req.file.filename}`
                        }
                    })
                    newCompany.save()
                        .then(() => res.send(newCompany))
                        .catch(err => new Error(err))
                }
            })
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
            const company = await companyService.deleteCompany(company_id);
            res.json(company);
        } catch (e) {
            next(e);
        }
    },
}