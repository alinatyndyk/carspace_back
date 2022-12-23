const {
    tokenService,
    authService,
    actionTokenService,
    previousPasswordService,
    userService,
    emailService, companyService
} = require("../services");
const {FORGOT_PASSWORD, FORGOT_PASSWORD_USER, FORGOT_PASSWORD_COMPANY} = require("../constants/token.type.enum");
const {FRONTEND_URL} = require("../configs/configs");
const {AUTHORIZATION} = require("../constants/constants");
const {sendEmail} = require("../services/email.service");
const {RESET_PASSWORD} = require("../constants/email.action.enum");

module.exports = {
    loginCompany: async (req, res, next) => {
        try {
            const {password} = req.body;
            const {password: hashPassword, _id} = req.company;

            await tokenService.comparePasswords(password, hashPassword);

            const authTokens = tokenService.createAuthTokensCompany({_id});

            await authService.saveTokensCompany({...authTokens, company: _id});

            res.json({...authTokens, company: req.company});
        } catch (e) {
            next(e);
        }
    },

    logoutCompany: async (req, res, next) => {
        try {
            const {company, access_token} = req.tokenInfo;
            console.log(company);
            await authService.deleteOneCompanyByParams({company, access_token});

            res.json('Logout page');
        } catch (e) {
            next(e);
        }
    },

    refreshCompany: async (req, res, next) => {
        try {
            const {company, refresh_token} = req.tokenInfo;

            await authService.deleteOneCompanyByParams({refresh_token});

            const authTokens = tokenService.createAuthTokensCompany({_id: company});

            const newTokens = await authService.saveTokensCompany({...authTokens, company});

            res.json(newTokens);
        } catch (e) {
            next(e);
        }
    },
// ------------------------------------------------------------------------
    loginUser: async (req, res, next) => {
        try {
            const {password} = req.body;
            const {password: hashPassword, _id} = req.user;

            await tokenService.comparePasswords(password, hashPassword);

            const authTokens = tokenService.createAuthTokensUser({_id});

            await authService.saveTokensUser({...authTokens, user: _id});

            res.json({...authTokens, user: req.user});
        } catch (e) {
            next(e);
        }
    },

    logoutUser: async (req, res, next) => {
        try {
            const {user, access_token} = req.tokenInfo;
            console.log(user);
            await authService.deleteOneUserByParams({user, access_token});

            res.json('Logout page');
        } catch (e) {
            next(e);
        }
    },

    refreshUser: async (req, res, next) => {
        try {
            const {user, refresh_token} = req.tokenInfo;

            await authService.deleteOneUserByParams({refresh_token});

            const authTokens = tokenService.createAuthTokensUser({_id: user});

            const newTokens = await authService.saveTokensUser({...authTokens, user});

            res.json(newTokens);
        } catch (e) {
            next(e);
        }
    },

    forgotPasswordUser: async (req, res, next) => {
        try {
            const {_id, email} = req.user;

            const actionToken = tokenService.createActionToken(FORGOT_PASSWORD_USER, {_id});

            const url = `${FRONTEND_URL}/password/forgot-pass-page?tokenAction=${actionToken}`
            console.log(url, '****************************************************');

            await emailService.sendEmail(email, FORGOT_PASSWORD, {url});
            const actionSchema = await actionTokenService.createActionToken({
                tokenType: FORGOT_PASSWORD_USER,
                user: _id,
                token: actionToken
            })


            res.json(actionSchema)
        } catch (e) {
            next(e);
        }
    },

    forgotPasswordCompany: async (req, res, next) => {
        try {
            const {_id, email} = req.company;

            const actionToken = tokenService.createActionToken(FORGOT_PASSWORD_COMPANY, {_id});

            const url = `${FRONTEND_URL}/password/forgot-pass-page?tokenAction=${actionToken}`
            console.log(url, '****************************************************');
            await emailService.sendEmail(email, FORGOT_PASSWORD, {url});
            const actionSchema = await actionTokenService.createActionToken({
                tokenType: FORGOT_PASSWORD_COMPANY,
                company: _id,
                token: actionToken
            })


            res.json(actionSchema)
        } catch (e) {
            next(e);
        }
    },

    setNewPasswordForgotUser: async (req, res, next) => {
        try {
            const {user} = req.tokenInfo;
            const {password} = req.body;
            const token = req.get(AUTHORIZATION);

            const prevPass = await previousPasswordService.savePasswordInfo({password: user.password, user: user._id})

            await authService.deleteManyByParams({user: user._id});
            await actionTokenService.deleteActionToken({token});

            const hashPassword = await tokenService.hashPassword(password);
            const updatedUser = await userService.updateUser(user._id, {password: hashPassword});
            await sendEmail(user.email, RESET_PASSWORD, {userName: user.name});
            res.json({updatedUser, prevPass});
        } catch (e) {
            next(e);
        }

    },

    setNewPasswordForgotCompany: async (req, res, next) => {
        try {
            const {company} = req.tokenInfo;
            console.log(company);
            const {password} = req.body;
            const token = req.get(AUTHORIZATION);

            const prevPass = await previousPasswordService.savePasswordInfoCompany({
                password: company.password,
                company: company._id
            })

            await authService.deleteManyByParamsCompany({company: company._id});
            await actionTokenService.deleteActionToken({token});

            const hashPassword = await tokenService.hashPassword(password);
            const updatedCompany = await companyService.updateCompany(company._id, {password: hashPassword});
            await sendEmail(company.email, RESET_PASSWORD, {userName: company.name});
            res.json({updatedCompany, prevPass});
        } catch (e) {
            next(e);
        }

    }
}