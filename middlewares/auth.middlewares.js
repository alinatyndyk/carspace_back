const {ApiError} = require("../errors");
const {tokenService, authService} = require("../services");
const {AUTHORIZATION} = require("../constants/constants");
const {REFRESH} = require("../constants/token.type.enum");

module.exports = {
    isAccessTokenValidCompany: async (req, res, next) => {
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

    isRefreshTokenValidCompany: async (req, res, next) => {
        try {
            const refresh_token = req.get(AUTHORIZATION);
            if (!refresh_token) {
                return next(new ApiError('You are unauthorized. No refresh token', 401))
            }

            tokenService.checkToken(refresh_token, REFRESH);

            const tokenInfo = await authService.getOneWithCompany({refresh_token});

            if (!tokenInfo) {
                return next(new ApiError('No valid refresh token', 401));
            }

            req.tokenInfo = tokenInfo;

            next();

        } catch (e) {
            next(e)
        }
    },

    isAccessTokenValidUser: async (req, res, next) => {
        try {
            const access_token = req.get(AUTHORIZATION);
            if (!access_token) {
                return next(new ApiError('You are unauthorized. No access token', 401))
            }
            tokenService.checkToken(access_token);

            const tokenInfo = await authService.getOneWithUser({access_token});

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

    isRefreshTokenValidUser: async (req, res, next) => {
        try {
            const refresh_token = req.get(AUTHORIZATION);
            if (!refresh_token) {
                return next(new ApiError('You are unauthorized. No refresh token', 401))
            }

            tokenService.checkToken(refresh_token, REFRESH);

            const tokenInfo = await authService.getOneWithUser({refresh_token});

            if (!tokenInfo) {
                return next(new ApiError('No valid refresh token', 401));
            }

            req.tokenInfo = tokenInfo;

            next();

        } catch (e) {
            next(e)
        }
    },
}