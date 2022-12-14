const {carService, companyService, orderCarService, tokenService} = require("../services");
const {ApiError} = require("../errors");

module.exports = {
    getAllCars: async (req, res, next) => {
        try {
            const cars = await carService.getAllCars()
            res.json(cars);
        } catch (e) {
            next(e);
        }
    },

    getCarById: async (req, res, next) => {
        try {
            const {car_id} = req.params;
            const car = await carService.getCarById(car_id);
            res.json(car);
        } catch (e) {
            next(e);
        }
    },

    createCar: async (req, res, next) => {
        try {
            const {_id} = req.tokenInfo.company;
            const car = await carService.createCar({...req.body, company: _id});
            const companyCars = await carService.getCarsByParams({company: _id});
            await companyService.updateCompany(_id, {cars: [...companyCars]})
            res.json(car);
        } catch (e) {
            next(e);
        }
    },

    updateCar: async (req, res, next) => {
        try {
            const {_id} = req.tokenInfo.company; // id of tokens company
            const {car_id} = req.params;

            const carForUpdate = await carService.getCarById(car_id);
            const company_id = carForUpdate.company;

            if (_id.toString() !== company_id.toString()) {
                return next(new ApiError('Access token doesnt belong to the car you are trying to update'))
            }

            const car = await carService.updateCar(car_id, req.body);
            res.json(car);
        } catch (e) {
            next(e);
        }
    },

    deleteCar: async (req, res, next) => {
        try {
            const {_id} = req.tokenInfo.company;
            const {car_id} = req.params;

            const carForDelete = await carService.getCarById(car_id);
            const company_id = carForDelete.company;

            if (_id.toString() !== company_id.toString()) {
                return next(new ApiError('Access token doesnt belong to the car you are trying to delete'))
            }

            const car = await carService.deleteCar(car_id);
            res.json(car);
        } catch (e) {
            next(e);
        }
    },

    orderCar: async (req, res, next) => {
        try {
            const {_id} = req.tokenInfo.user; // objectId of tokens user
            const {car_id} = req.params; //string
            const {time_period, date} = req.body;

            const carToken = await tokenService.createCarToken({_id, time_period});

            const order = await orderCarService.createCarOrder({
                user: _id,
                car: car_id,
                car_token: carToken,
                time_period,
                date
            });

            res.json(order);
        } catch (e) {
            next(e);
        }
    },
}