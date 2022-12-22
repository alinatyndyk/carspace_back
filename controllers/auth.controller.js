const {
    tokenService,
    authService,
    actionTokenService,
    previousPasswordService,
    userService,
    emailService
} = require("../services");
const {FORGOT_PASSWORD} = require("../constants/token.type.enum");
const {FRONTEND_URL} = require("../configs/configs");
const {AUTHORIZATION} = require("../constants/constants");

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

    forgotPassword: async (req, res, next) => {
        try {
            const {_id, email} = req.user;

            const actionToken = tokenService.createActionToken(FORGOT_PASSWORD, {_id});

            const url = `${FRONTEND_URL}/password/forgot-pass-page?tokenAction=${actionToken}`
            console.log(url, '****************************************************');
            await emailService.sendEmail(email, FORGOT_PASSWORD, {url});
            const actionTokenSchema = await actionTokenService.createActionToken({
                tokenType: FORGOT_PASSWORD,
                user: _id,
                token: actionToken
            })


            res.json(actionTokenSchema);
        } catch (e) {
            next(e);
        }
    },

    setNewPasswordForgot: async (req, res, next) => {
        try {
            const token = req.get(AUTHORIZATION);
            const {user} = req.tokenInfo;
            const {password} = req.body;

            const previousPassword = await previousPasswordService.savePasswordInfoUser({password: user.password, user});

            await authService.deleteManyByParams({user: user._id});
            await actionTokenService.deleteActionToken({token});

            const hashPassword = await tokenService.hashPassword(password);
            const updatedUser = await userService.updateUser(user._id, {password: hashPassword});

            res.json({previousPassword, updatedUser});
        } catch (e) {
            next(e);
        }

    }
}