const jwt = require("jsonwebtoken");

const {carValidators} = require("../validators");
const {ApiError} = require("../errors");
const {carService, orderCarService, tokenService} = require("../services");
const {ORDER_CAR_WORD} = require("../configs/configs");
const {TokenExpiredError} = require("jsonwebtoken");
const {ORDER_CAR} = require("../constants/token.type.enum");

module.exports = {
    carBodyValid: (validatorType) => async (req, res, next) => {
        try {
            console.log(validatorType);
            const validate = carValidators[validatorType].validate(req.body);

            if (validate.error) {
                return next(new ApiError(validate.error.message, 400))
            }

            next();
        } catch (e) {
            next(e)
        }
    },

    searchCarsWithQuery: async (req, res, next) => {
        try {
            const cars = await carService.getCarsByParams(req.query);

            if (!cars) {
                return next(new ApiError('Cars were not found. Try later', 404));
            }

            res.json(cars);
            next();
        } catch (e) {
            next(e)
        }
    },

    isCarTaken: (from = 'params') => async (req, res, next) => {
        try {
            const {car_id} = req[from];
            const {_id} = req.tokenInfo.user;

            // const order = await orderCarService.getCarOrderByParams({car: car_id, user: {$ne: _id}});
            const order = await orderCarService.getCarOrderByParams({car: car_id});
            console.log(order, 'order');
            console.log(order.car_token);

            await jwt.verify(order.car_token, ORDER_CAR_WORD);

            if (order) {
                try {
                    // await tokenService.checkToken(order.car_token, ORDER_CAR);
                    await jwt.verify(order.car_token, ORDER_CAR_WORD);
                    next(new ApiError('The car is taken', 400))
                } catch (e) {
                    if (e.message === 'jwt expired') {
                        console.log(e.message);
                        await orderCarService.deleteCarOrderByParams({car: car_id});
                        console.log('DDDDDDDDDDDDDDDDDDDDDDDDDD');
                    }
                }
                //todo car token verification

            }

            console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
            req.order = order; //todo delete req order,
            next();
        } catch (e) {
            next(e)
        }
    },
}