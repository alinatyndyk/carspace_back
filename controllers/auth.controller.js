const {tokenService, authService} = require("../services");

module.exports = {
    loginCompany: async (req, res, next) => {
        try {
            const {password} = req.body;
            const {password: hashPassword, _id} = req.company;

            await tokenService.comparePasswords(password, hashPassword);

            const authTokens = tokenService.createAuthTokens({_id});

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

            const authTokens = tokenService.createAuthTokens({_id: company});

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
            const {password: hashPassword, _id} = req.company;

            await tokenService.comparePasswords(password, hashPassword);

            const authTokens = tokenService.createAuthTokens({_id});

            await authService.saveTokensUser({...authTokens, company: _id});

            res.json({...authTokens, company: req.company});
        } catch (e) {
            next(e);
        }
    },

    logoutUser: async (req, res, next) => {
        try {
            const {company, access_token} = req.tokenInfo;
            console.log(company);
            await authService.deleteOneUserByParams({company, access_token});

            res.json('Logout page');
        } catch (e) {
            next(e);
        }
    },

    refreshUser: async (req, res, next) => {
        try {
            const {company, refresh_token} = req.tokenInfo;

            await authService.deleteOneUserByParams({refresh_token});

            const authTokens = tokenService.createAuthTokens({_id: company});

            const newTokens = await authService.saveTokensUser({...authTokens, company});

            res.json(newTokens);
        } catch (e) {
            next(e);
        }
    },
}