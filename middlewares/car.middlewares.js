const {carValidators} = require("../validators");
const {ApiError} = require("../errors");
const {carService, orderCarService} = require("../services");
const {OrderCar} = require("../dataBase");

module.exports = {
    carBodyValid: (validatorType) => async (req, res, next) => {
        try {
            console.log(validatorType);
            console.log(req.body);
            const validate = carValidators[validatorType].validate(req.body);

            if (validate.error) {
                return next(new ApiError(validate.error.message, 400))
            }

            next();
        } catch (e) {
            next(e)
        }
    },

    isCarTaken: (from = 'params') => async (req, res, next) => {
        try {
            const {car_id} = req[from];
            const orders = await orderCarService.getCarOrdersByParams({car: car_id});
            const {from_date, to_date} = req.body;

            const getDaysArray = function (s, e) {
                for (a = [], d = new Date(s); d <= new Date(e); d.setDate(d.getDate() + 1)) {
                    a.push(new Date(d));
                }
                return a;
            };
            orders.forEach(order => {
                const daylist = getDaysArray(new Date(order.from_date).setHours(0), new Date(order.to_date).setHours(0));
                daylist.map((v) => v.toISOString().slice(0, 10)).join("");
                const daylistBook = getDaysArray(new Date(from_date).setHours(0), new Date(to_date).setHours(0));
                daylistBook.map((v) => v.toISOString().slice(0, 10)).join("");
                x = daylist.map(day => day.getTime());
                y = daylistBook.map(day => day.getTime());
                const output = y.filter(function (obj) {
                    return x.indexOf(obj) !== -1;
                });
                if (output.length !== 0) {
                    next(new ApiError(`The car is taken from ${order.from_date} - ${order.to_date}`)); //todo no console
                }

            })

            next();
        } catch (e) {
            next(e)
        }
    },

    filterCarsByDates: async (req, res, next) => {
        try {
            let availableCars = [];
            const {from_date, to_date} = req.body;
            console.log(req.query, 'req query');
            console.log(req.body);

            let {page} = req.query;
            let {page: pageBody} = req.body;

            if (!page) {
                page = pageBody;
                if (!pageBody) page = 1;
            }
            const limit = 2;
            // const skip = (page - 1) * 2;

            const fromDate = new Date(from_date).getTime();
            const toDate = new Date(to_date).getTime();
            const Today = new Date().getTime();

            if (Today > fromDate) {
                console.log('today > fromdate');
                return next(new ApiError('Choose a date after or equal to today', 409))
            }
            if (toDate < fromDate) {
                console.log('todate < fromdate');
                return next(new ApiError('Choose a date after starting date', 409))
            }

            const str = req.body.description.replaceAll("_", ' ').toLowerCase();
            console.log(str, 'str');
            console.log('filter by dates controller');

            // const cars = await carService.searchCarByDescription(req.body.description.toLowerCase());
            const cars = await carService.searchCarByDescription(str);
            const getDaysArray = function (s, e) {
                for (a = [], d = new Date(s); d <= new Date(e); d.setDate(d.getDate() + 1)) {
                    a.push(new Date(d));
                }
                return a;
            };

            for (const car of cars) {
                const orders = await orderCarService.getCarOrdersByParams({car: car._id});

                let output;
                orders?.forEach(order => {
                    const daylist = getDaysArray(new Date(order.from_date).setHours(0), new Date(order.to_date).setHours(0));
                    daylist.map((v) => v.toISOString().slice(0, 10)).join("");
                    const daylistBook = getDaysArray(new Date(from_date).setHours(0), new Date(to_date).setHours(0));
                    daylistBook.map((v) => v.toISOString().slice(0, 10)).join("");
                    x = daylist.map(day => day.getTime());
                    y = daylistBook.map(day => day.getTime());
                    output = y.filter(function (obj) {
                        return x.indexOf(obj) !== -1;
                    });
                    return output
                })

                console.log(output, 'output');

                // if (output === undefined || []) {
                //     availableCars.push(car);
                // }

                if (!output || !output.length) {
                    availableCars.push(car);
                }
            }
            const finish = page * limit;
            const start = finish - limit;
            console.log({page, limit, finish, start});
            const slicedCars = availableCars.slice(start, finish);
            res.json(slicedCars);
        } catch (e) {
            next(e)
        }
    },
}