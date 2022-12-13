const {ApiError} = require("../errors");
const {tokenService, authService, actionTokenService} = require("../services");
const {ACCESS_TOKEN, REFRESH_TOKEN, AUTHORIZATION} = require("../constants/constants");
const {
    ACCESS_COMPANY,
    REFRESH_COMPANY,
    ACCESS_USER,
    REFRESH_USER,
    ACCESS_ADMIN
} = require("../constants/token.type.enum");

module.exports = {
    isAccessTokenValidCompany: async (req, res, next) => {
        try {
            const access_token = req.get(ACCESS_TOKEN);
            if (!access_token) {
                return next(new ApiError('You are unauthorized. No access token for company', 401))
            }
            tokenService.checkToken(access_token, ACCESS_COMPANY);

            const tokenInfo = await authService.getOneWithCompany({access_token});

            console.log(tokenInfo, '----------------------------------------token info');

            if (!tokenInfo) {
                return next(new ApiError('No valid token for company', 401))
            }
            req.tokenInfo = tokenInfo;

            next();
        } catch (e) {
            next(e)
        }
    },

    isRefreshTokenValidCompany: async (req, res, next) => {
        try {
            const refresh_token = req.get(REFRESH_TOKEN);
            if (!refresh_token) {
                return next(new ApiError('You are unauthorized. No refresh token for company', 401))
            }

            tokenService.checkToken(refresh_token, REFRESH_COMPANY);

            const tokenInfo = await authService.getOneWithCompany({refresh_token});

            if (!tokenInfo) {
                return next(new ApiError('No valid refresh token for company', 401));
            }

            req.tokenInfo = tokenInfo;

            next();

        } catch (e) {
            next(e)
        }
    },

    isAccessTokenValidUser: async (req, res, next) => {
        try {
            const access_token = req.get(ACCESS_TOKEN);
            if (!access_token) {
                return next(new ApiError('You are unauthorized. No access token for user', 401))
            }
            tokenService.checkToken(access_token, ACCESS_USER);

            const tokenInfo = await authService.getOneWithUser({access_token});

            if (!tokenInfo) {
                return next(new ApiError('No valid token for user', 401))
            }

            req.tokenInfo = tokenInfo;
            console.log(tokenInfo.user);
            next();
        } catch (e) {
            next(e)
        }
    },

    isRefreshTokenValidUser: async (req, res, next) => {
        try {
            const refresh_token = req.get(REFRESH_TOKEN);
            if (!refresh_token) {
                return next(new ApiError('You are unauthorized. No refresh token for user', 401))
            }

            tokenService.checkToken(refresh_token, REFRESH_USER);

            const tokenInfo = await authService.getOneWithUser({refresh_token});

            if (!tokenInfo) {
                return next(new ApiError('No valid refresh token for user', 401));
            }

            req.tokenInfo = tokenInfo;

            next();

        } catch (e) {
            next(e)
        }
    },

    isActionTokenValid: (tokenType) => async (req, res, next) => {
        try {
            const token = req.get(AUTHORIZATION); // todo get from params
            tokenService.checkToken(token, tokenType);

            if (!token) {
                return next(new ApiError('No action token', 401))
            }

            const tokenInfo = await actionTokenService.getOneBySearchParamsWithUser({tokenType, token});

            if (!tokenInfo) {
                return next(new ApiError('no valid token', 401))
            }

            req.tokenInfo = tokenInfo;

            next();
        } catch (e) {
            next(e)
        }
    },

    checkPreviousPassword: async (req, res, next) => {
        try {
            const {user} = req.tokenInfo;
            const {password} = req.body;
            const oldPasswords = await previousPasswordService.getByUserId(user._id);

            const promises = await Promise.allSettled([oldPasswords.map(old => tokenService.comparePasswords(password, old.password)),
                tokenService.comparePasswords(password, user.password)]);

            for (const {status} of promises) {
                if (status === 'fulfilled') {
                    return next(new ApiError('Choose a new password', 400))
                }
            }

            next();
        } catch (e) {
            next(e)
        }
    },

    // todo admin token check

    isAccessTokenValidAdmin: async (req, res, next) => {
        try {
            const access_token = req.get(ACCESS_TOKEN);
            if (!access_token) {
                return next(new ApiError('You are unauthorized. No access token for admin', 401))
            }
            tokenService.checkToken(access_token, ACCESS_ADMIN);

            const tokenInfo = await authService.getOneWithUser({access_token});

            console.log(tokenInfo, '----------------------------------------token info');

            if (!tokenInfo) {
                return next(new ApiError('No valid token for user', 401))
            }
            req.tokenInfo = tokenInfo;

            next();
        } catch (e) {
            next(e)
        }
    },

    isRefreshTokenValidAdmin: async (req, res, next) => {
        try {
            const refresh_token = req.get(REFRESH_TOKEN);
            if (!refresh_token) {
                return next(new ApiError('You are unauthorized. No refresh token for user', 401))
            }

            tokenService.checkToken(refresh_token, REFRESH_USER);

            const tokenInfo = await authService.getOneWithUser({refresh_token});

            if (!tokenInfo) {
                return next(new ApiError('No valid refresh token for user', 401));
            }

            req.tokenInfo = tokenInfo;

            next();

        } catch (e) {
            next(e)
        }
    },
}