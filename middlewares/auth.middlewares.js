const {ApiError} = require("../errors");
const {tokenService, authService} = require("../services");
const {AUTHORIZATION} = require("../constants/constants");
module.exports = {
    isAccessTokenValid: async (req, res, next) => {
        try {
            const access_token = req.get(AUTHORIZATION);
            if (!access_token) {
                return next(new ApiError('You are unauthorized. No access token', 401))
            }
            tokenService.checkToken(access_token);

            const tokenInfo = await authService.getOneWithCompany({access_token});

            console.log(tokenInfo, '----------------------------------------token info');

            if (!tokenInfo) {
                return next(new ApiError('No valid token', 401))
            }
            req.tokenInfo = tokenInfo;

            next();
        } catch (e) {
            next(e)
        }
    },
}