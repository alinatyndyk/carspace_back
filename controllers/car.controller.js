const {carService, companyService} = require("../services");

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
            const {car_id} = req.params;
            const car = await carService.updateCar(car_id, req.body);
            res.json(car);
        } catch (e) {
            next(e);
        }
    },

    deleteCar: async (req, res, next) => {
        try {
            const {car_id} = req.params;
            const car = await carService.deleteCar(car_id);
            res.json(car);
        } catch (e) {
            next(e);
        }
    },
}