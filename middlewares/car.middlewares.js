const {carValidators} = require("../validators");
const {ApiError} = require("../errors");
const {carService, userService, orderCarService} = require("../services");
const {object} = require("joi");
const {Types} = require("mongoose");

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
            console.log(car_id, 'caris from params mldwr');


            const order = await orderCarService.getCarOrderByParams({car: car_id}); //todo
            console.log(order, 'order by car id --------------------------------------------****');

            if (!order) {
                next();
            }

            req.order = order; //todo delete req order

            next(new ApiError('The car is currently taken', 400));

        } catch (e) {
            next(e)
        }
    },
}