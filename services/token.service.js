const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const {ApiError} = require("../errors");
const {
    ACCESS_SECRET_WORD, REFRESH_SECRET_WORD, ACCESS_SECRET_WORD_USER, REFRESH_SECRET_WORD_USER,
    ACCESS_SECRET_WORD_COMPANY, REFRESH_SECRET_WORD_COMPANY,
    ACTION_TOKEN_SECRET, ORDER_CAR_WORD, FORGOT_PASSWORD_USER_WORD, FORGOT_PASSWORD_COMPANY_WORD,
    VERIFICATION_STRING_WORD, ACCESS_SECRET_WORD_ADMIN, REFRESH_SECRET_WORD_ADMIN, FORGOT_PASSWORD_ADMIN_WORD
} = require("../configs/configs");
const {
    ACCESS_USER,
    REFRESH_USER,
    ACCESS_COMPANY,
    REFRESH_COMPANY, ACCESS_ADMIN, REFRESH_ADMIN, FORGOT_PASSWORD, ORDER_CAR, FORGOT_PASSWORD_USER,
    FORGOT_PASSWORD_COMPANY, ACCESS, REFRESH, VERIFICATION_STRING, FORGOT_PASSWORD_ADMIN
} = require("../constants/token.type.enum");
const orderCarService = require("../services/order.car.service");

module.exports = {
    hashPassword: (password) => bcrypt.hash(password, 10),
    comparePasswords: async (password, hashPassword) => {
        const isPasswordsSame = await bcrypt.compare(password, hashPassword);

        if (!isPasswordsSame) {
            throw new ApiError('Wrong email or password', 400);
        }
    },

    createAuthTokensUser: (payload = {}) => {
        const access_token = jwt.sign(payload, ACCESS_SECRET_WORD_USER, {expiresIn: '10m'})
        const refresh_token = jwt.sign(payload, REFRESH_SECRET_WORD_USER, {expiresIn: '30d'})

        return {
            access_token: `User ${access_token}`,
            refresh_token: `User ${refresh_token}`
        }
    },

    createAuthTokensAdmin: (payload = {}) => {
        const access_token = jwt.sign(payload, ACCESS_SECRET_WORD_ADMIN, {expiresIn: '10m'})
        const refresh_token = jwt.sign(payload, REFRESH_SECRET_WORD_ADMIN, {expiresIn: '30d'})

        return {
            access_token: `Admin ${access_token}`,
            refresh_token: `Admin ${refresh_token}`
        }
    },

    createAuthTokensCompany: (payload = {}) => {
        const access_token = jwt.sign(payload, ACCESS_SECRET_WORD_COMPANY, {expiresIn: '10m'})
        const refresh_token = jwt.sign(payload, REFRESH_SECRET_WORD_COMPANY, {expiresIn: '30d'})

        return {
            access_token: `Company ${access_token}`,
            refresh_token: `Company ${refresh_token}`
        }
    },

    createActionToken: (tokenType, payload = {}) => {
        let expiresIn = '7d';
        let word;
        switch (tokenType) {
            case FORGOT_PASSWORD_USER:
                word = FORGOT_PASSWORD_USER_WORD
                expiresIn = '1d';
                break;
            case FORGOT_PASSWORD_COMPANY:
                word = FORGOT_PASSWORD_COMPANY_WORD
                expiresIn = '1d';
                break;
            case FORGOT_PASSWORD_ADMIN:
                word = FORGOT_PASSWORD_ADMIN_WORD
                expiresIn = '1d';
                break;
        }
        return jwt.sign(payload, word, {expiresIn})
    },

    createCarToken: (payload = {}) => {
        return jwt.sign(payload, ORDER_CAR_WORD);
    },

    createVerificationString: (payload = {}) => {
        let expiresIn = '10m'
        return jwt.sign(payload, VERIFICATION_STRING_WORD, {expiresIn});
    },

    checkToken: (token, tokenType = ACCESS) => {
        try {

            let word;
            let cut = token;
            let first;
            switch (tokenType) {
                case ACCESS:
                    word = ACCESS_SECRET_WORD
                    break;
                case REFRESH:
                    word = REFRESH_SECRET_WORD
                    break;
                case ACCESS_USER:
                    word = ACCESS_SECRET_WORD_USER
                    cut = token.substr(token.indexOf(" ") + 1);
                    break;
                case REFRESH_USER:
                    word = REFRESH_SECRET_WORD_USER
                    cut = token.substr(token.indexOf(" ") + 1);
                    first = token.split(' ')[0]
                    console.log(first);
                    break;
                case ACCESS_COMPANY:
                    word = ACCESS_SECRET_WORD_COMPANY
                    cut = token.substr(token.indexOf(" ") + 1);
                    break;
                case REFRESH_COMPANY:
                    word = REFRESH_SECRET_WORD_COMPANY
                    cut = token.substr(token.indexOf(" ") + 1);
                    first = token.split(' ')[0]
                    break;
                case ACCESS_ADMIN:
                    cut = token.substr(token.indexOf(" ") + 1);
                    word = ACCESS_SECRET_WORD_ADMIN
                    break;
                case REFRESH_ADMIN:
                    cut = token.substr(token.indexOf(" ") + 1);
                    word = REFRESH_SECRET_WORD_ADMIN
                    break;
                case VERIFICATION_STRING:
                    word = VERIFICATION_STRING_WORD
                    break;
                case FORGOT_PASSWORD:
                    word = ACTION_TOKEN_SECRET;
                    break;
                case ORDER_CAR:
                    word = ORDER_CAR_WORD
                    break;
                case FORGOT_PASSWORD_USER:
                    word = FORGOT_PASSWORD_USER_WORD
                    break;
                case FORGOT_PASSWORD_ADMIN:
                    word = FORGOT_PASSWORD_ADMIN_WORD
                    break;
                case FORGOT_PASSWORD_COMPANY:
                    word = FORGOT_PASSWORD_COMPANY_WORD
                    break;
            }
            return jwt.verify(cut, word);
        } catch (e) {
            if (e.message === 'jwt expired') {
                throw new ApiError(`Token not valid. ${e.message}`, 401);
            } else {
                throw new ApiError(`Token not valid. ${e.message}`, 406);
            }
        }
    },

    verifyOrderToken: async (order) => {
        try {
            console.log('try -------------------------------')
            return jwt.verify(order.car_token, ORDER_CAR_WORD);
        } catch (e) {
            console.log(e.message);
            if (e.message === 'jwt expired') {
                console.log('catch if jwt expired ---------------------------------')
                const deletedOrder = await orderCarService.deleteCarOrderById(order._id);
                return deletedOrder
            }
        }
    },
}