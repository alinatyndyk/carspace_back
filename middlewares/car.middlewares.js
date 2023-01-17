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
            // console.log(order, 'order');
            // console.log(order.from_date, order.to_date, 'dates booked --------------------------');
            const {from_date, to_date} = req.body;
            console.log(from_date, to_date, 'dates from req body --------------------------');

            const getDaysArray = function (s, e) {
                for (a = [], d = new Date(s); d <= new Date(e); d.setDate(d.getDate() + 1)) {
                    a.push(new Date(d));
                }
                return a;
            };
            orders.forEach(order => {
                // console.log(order.from_date);
                const daylist = getDaysArray(new Date(order.from_date).setHours(0), new Date(order.to_date).setHours(0));
                daylist.map((v) => v.toISOString().slice(0, 10)).join("");
                // console.log(daylist, 'daylist');
                const daylistBook = getDaysArray(new Date(from_date).setHours(0), new Date(to_date).setHours(0));
                daylistBook.map((v) => v.toISOString().slice(0, 10)).join("");
                // console.log(daylistBook, 'daylistBook');
                x = daylist.map(day => day.getTime());
                y = daylistBook.map(day => day.getTime());
                // console.log(x, 'xxxx');
                // console.log(y, 'yyyy');
                const output = y.filter(function (obj) {
                    return x.indexOf(obj) !== -1;
                });
                // console.log(output, 'output *********');
                if (output.length !== 0) {
                    next(new ApiError(`The car is taken from ${order.from_date} - ${order.to_date}`)); //todo no console
                }

            })

            next();
        } catch (e) {
            next(e)
        }
    },

    isCarTaken: (from = 'params') => async (req, res, next) => {
        try {
            const {car_id} = req[from];
            const orders = await orderCarService.getCarOrdersByParams({car: car_id});
            // console.log(order, 'order');
            // console.log(order.from_date, order.to_date, 'dates booked --------------------------');
            const {from_date, to_date} = req.body;
            console.log(from_date, to_date, 'dates from req body --------------------------');

            const getDaysArray = function (s, e) {
                for (a = [], d = new Date(s); d <= new Date(e); d.setDate(d.getDate() + 1)) {
                    a.push(new Date(d));
                }
                return a;
            };
            orders.forEach(order => {
                // console.log(order.from_date);
                const daylist = getDaysArray(new Date(order.from_date).setHours(0), new Date(order.to_date).setHours(0));
                daylist.map((v) => v.toISOString().slice(0, 10)).join("");
                // console.log(daylist, 'daylist');
                const daylistBook = getDaysArray(new Date(from_date).setHours(0), new Date(to_date).setHours(0));
                daylistBook.map((v) => v.toISOString().slice(0, 10)).join("");
                // console.log(daylistBook, 'daylistBook');
                x = daylist.map(day => day.getTime());
                y = daylistBook.map(day => day.getTime());
                // console.log(x, 'xxxx');
                // console.log(y, 'yyyy');
                const output = y.filter(function (obj) {
                    return x.indexOf(obj) !== -1;
                });
                // console.log(output, 'output *********');
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
            const cars = await carService.searchCarByDescription(req.body.description);
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
                    console.log('in orders for each');
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
                if (output === undefined) {
                    availableCars.push(car);
                }
            }
            res.json(availableCars);
            // next();
        } catch (e) {
            next(e)
        }
    },
}