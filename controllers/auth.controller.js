const {tokenService, authService} = require("../services");

module.exports = {
    login: async (req, res, next) => {
        try {
            const {password} = req.body;
            const {password: hashPassword, _id} = req.company;

            await tokenService.comparePasswords(password, hashPassword);

            const authTokens = tokenService.createAuthTokens({_id});

            await authService.saveTokens({...authTokens, company: _id});

            res.json({...authTokens, company: req.company});
        } catch (e) {
            next(e);
        }
    }
}