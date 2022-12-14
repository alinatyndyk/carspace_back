const {carValidators} = require("../validators");
const {ApiError} = require("../errors");
const {carService, orderCarService} = require("../services");
const {logoutCompany} = require("../controllers/auth.controller");

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

            const order = await orderCarService.getCarOrderByParams({car: car_id}); //todo

            console.log(order, 'order');
            if (order) {
                return next(new ApiError('The car is currently taken', 400));
            }

            req.order = order; //todo delete req order
            next();
        } catch (e) {
            next(e)
        }
    },
}