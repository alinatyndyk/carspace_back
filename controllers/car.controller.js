const {carService, companyService, orderCarService, tokenService} = require("../services");
const {ApiError} = require("../errors");
const {sendEmail} = require("../services/email.service");
const {COMPANY_CREATE, ORDER_CREATION} = require("../constants/email.action.enum");

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
            const {brand} = req.body;
            const brand_db = brand.replace(/\s/g, '_');
            const car = await carService.createCar({...req.body, company: _id, brand_db});
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

            const car = await carService.updateCar(car_id, req.body,);
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
            const {_id, email} = req.tokenInfo.user; // objectId of tokens user
            const {car_id} = req.params; //string
            const {from_date, to_date} = req.body;
            console.log(from_date, to_date, 'time period-----------------------1st');

            // const fromDate = new Date(from_date).setHours(8);
            const fromDate = new Date(from_date).getTime();
            const toDate = new Date(to_date).getTime();
            const Difference_In_Time = toDate - fromDate;
            const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            console.log(fromDate, toDate, Difference_In_Days);

            const carToken = await tokenService.createCarToken({nbf: fromDate, exports: toDate}); //nbf exp

            await sendEmail(email, ORDER_CREATION, {user_id: _id, order_id: 'id xxx', car_id});

            const order = await orderCarService.createCarOrder({
                user: _id,
                car: car_id,
                car_token: carToken,
                from_date,
                to_date,
                Difference_In_Days
            });

            res.json(order);
        } catch (e) {
            next(e);
        }
    },
}