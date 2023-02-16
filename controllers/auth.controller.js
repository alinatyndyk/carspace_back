const {
    tokenService,
    authService,
    actionTokenService,
    previousPasswordService,
    userService,
    emailService, companyService
} = require("../services");
const {FORGOT_PASSWORD, FORGOT_PASSWORD_USER, FORGOT_PASSWORD_COMPANY} = require("../constants/token.type.enum");
const {AUTHORIZATION} = require("../constants/constants");
const {sendEmail} = require("../services/email.service");
const {RESET_PASSWORD} = require("../constants/email.action.enum");

module.exports = {
    loginCompany: async (req, res, next) => {
        try {
            const {password} = req.body;
            const {password: hashPassword, _id} = req.company;
            await tokenService.comparePasswords(password, hashPassword);

            const authTokens = tokenService.createAuthTokensCompany({_id: _id._id});
            await authService.saveTokensCompany({...authTokens, company: _id._id});

            res.json(authTokens);
        } catch (e) {
            next(e);
        }
    },

    logoutCompany: async (req, res, next) => {
        try {
            const {company, access_token} = req.tokenInfo;
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

            const authTokens = tokenService.createAuthTokensCompany({_id: company._id});
            await authService.saveTokensCompany({...authTokens, company: company._id});

            res.json(authTokens);
        } catch (e) {
            next(e);
        }
    },

    loginUser: async (req, res, next) => {
        try {
            const {password} = req.body;
            const {password: hashPassword, _id} = req.user;
            await tokenService.comparePasswords(password, hashPassword);

            const authTokens = tokenService.createAuthTokensUser({_id});
            await authService.saveTokensUser({...authTokens, user: _id});

            res.json(authTokens);
        } catch (e) {
            next(e);
        }
    },

    logoutUser: async (req, res, next) => {
        try {
            const {user, access_token} = req.tokenInfo;
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
            await authService.saveTokensUser({...authTokens, user});

            res.json(authTokens);
        } catch (e) {
            next(e);
        }
    },

    forgotPasswordUser: async (req, res, next) => {
        try {
            const {_id, email} = req.user;

            const action_token = tokenService.createActionToken(FORGOT_PASSWORD_USER, {_id});

            const url = `http://localhost:3000/password-reset?tokenAction=${action_token}`

            await emailService.sendEmail(email, FORGOT_PASSWORD, {url});
            await actionTokenService.createActionToken({
                tokenType: FORGOT_PASSWORD_USER,
                user: _id,
                token: action_token
            })

            res.send('The letter was sent');
        } catch (e) {
            next(e);
        }
    },

    forgotPasswordCompany: async (req, res, next) => {
        try {
            const {_id, email} = req.company;

            const action_token = tokenService.createActionToken(FORGOT_PASSWORD_COMPANY, {_id});

            const url = `http://localhost:3000/password-reset/company?tokenAction=${action_token}`
            await emailService.sendEmail(email, FORGOT_PASSWORD, {url});
            await actionTokenService.createActionToken({
                tokenType: FORGOT_PASSWORD_COMPANY,
                company: _id,
                token: action_token
            })


            res.json({action_token})
        } catch (e) {
            next(e);
        }
    },

    setNewPasswordForgotUser: async (req, res, next) => {
        try {
            const {user} = req.tokenInfo;
            const {password} = req.body;
            const token = req.get(AUTHORIZATION);

            await previousPasswordService.savePasswordInfo({password: user.password, user: user._id})

            await authService.deleteManyByParams({user: user._id});
            await actionTokenService.deleteActionToken({token});

            const hashPassword = await tokenService.hashPassword(password);
            await userService.updateUser(user._id, {password: hashPassword});
            await sendEmail(user.email, RESET_PASSWORD, {userName: user.name});
            res.json('The password was been changed successfully');
        } catch (e) {
            next(e);
        }

    },

    setNewPasswordForgotCompany: async (req, res, next) => {
        try {
            const {company} = req.tokenInfo;
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