const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const {ApiError} = require("../errors");
const {
    ACCESS_SECRET_WORD, REFRESH_SECRET_WORD, ACCESS_SECRET_WORD_USER, REFRESH_SECRET_WORD_USER,
    ACCESS_SECRET_WORD_COMPANY, REFRESH_SECRET_WORD_COMPANY, ACCESS_SECRET_WORD_ADMIN, REFRESH_SECRET_WORD_ADMIN,
    ACTION_TOKEN_SECRET, ORDER_CAR_WORD
} = require("../configs/configs");
const {
    ACCESS,
    REFRESH,
    ACCESS_USER,
    REFRESH_USER,
    ACCESS_COMPANY,
    REFRESH_COMPANY, ACCESS_ADMIN, REFRESH_ADMIN, FORGOT_PASSWORD, ORDER_CAR
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

    // createAuthTokens: (payload = {}) => {
    //     const access_token = jwt.sign(payload, ACCESS_SECRET_WORD, {expiresIn: '10m'})
    //     const refresh_token = jwt.sign(payload, REFRESH_SECRET_WORD, {expiresIn: '30d'})
    //
    //     return {
    //         access_token,
    //         refresh_token
    //     }
    // },

    createAuthTokensUser: (payload = {}) => {
        const access_token = jwt.sign(payload, ACCESS_SECRET_WORD_USER, {expiresIn: '30m'})
        const refresh_token = jwt.sign(payload, REFRESH_SECRET_WORD_USER, {expiresIn: '30d'})

        return {
            access_token,
            refresh_token
        }
    },

    createAuthTokensCompany: (payload = {}) => {
        const access_token = jwt.sign(payload, ACCESS_SECRET_WORD_COMPANY, {expiresIn: '10m'})
        const refresh_token = jwt.sign(payload, REFRESH_SECRET_WORD_COMPANY, {expiresIn: '30d'})

        return {
            access_token,
            refresh_token
        }
    },

    createAuthTokensAdmin: (payload = {}) => {
        const access_token = jwt.sign(payload, ACCESS_SECRET_WORD_ADMIN, {expiresIn: '10m'})
        const refresh_token = jwt.sign(payload, REFRESH_SECRET_WORD_ADMIN, {expiresIn: '30d'})

        return {
            access_token,
            refresh_token
        }
    },

    createActionToken: (tokenType, payload = {}) => {
        let expiresIn = '7d';
        if (tokenType === FORGOT_PASSWORD) {
            expiresIn = '1d';
        }

        return jwt.sign(payload, ACTION_TOKEN_SECRET, {expiresIn})
    },

    createCarToken: (payload = {}) => {
        return jwt.sign(payload, ORDER_CAR_WORD);
    },

    checkToken: (token, tokenType = ACCESS) => {
        try {

            let word;
            switch (tokenType) {
                case ACCESS:
                    word = ACCESS_SECRET_WORD
                    break;
                case REFRESH:
                    word = REFRESH_SECRET_WORD
                    break;
                case ACCESS_USER:
                    word = ACCESS_SECRET_WORD_USER
                    break;
                case REFRESH_USER:
                    word = REFRESH_SECRET_WORD_USER
                    break;
                case ACCESS_COMPANY:
                    word = ACCESS_SECRET_WORD_COMPANY
                    break;
                case REFRESH_COMPANY:
                    word = REFRESH_SECRET_WORD_COMPANY
                    break;
                case ACCESS_ADMIN:
                    word = ACCESS_SECRET_WORD_ADMIN
                    break;
                case REFRESH_ADMIN:
                    word = REFRESH_SECRET_WORD_ADMIN
                    break;
                case FORGOT_PASSWORD:
                    word = ACTION_TOKEN_SECRET;
                    break;
                case ORDER_CAR:
                    word = ORDER_CAR_WORD
            }
            return jwt.verify(token, word);
        } catch (e) {
            throw new ApiError(`Token not valid ${token}`, 400)
        }
    },

    verifyOrderToken: async (order) => {
        try {
            console.log('try -------------------------------')
            return jwt.verify(order.car_token, ORDER_CAR_WORD);
        } catch (e) {
            console.log(e.message);
            if(e.message === 'jwt expired'){
            console.log('catch if jwt expired ---------------------------------')
            const deletedOrder = await orderCarService.deleteCarOrderById(order._id);
            return deletedOrder
            }
        }
    },
}