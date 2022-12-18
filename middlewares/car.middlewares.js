const {carValidators} = require("../validators");
const {ApiError} = require("../errors");
const {carService, orderCarService} = require("../services");

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
            const orders = await orderCarService.getCarOrdersByParams({car: car_id});
            // console.log(order, 'order');
            // console.log(order.from_date, order.to_date, 'dates booked --------------------------');
            const {from_date, to_date} = req.body; // we try to book
            console.log(from_date, to_date, 'dates from req body --------------------------');

            const getDaysArray = function (s, e) {
                for (a = [], d = new Date(s); d <= new Date(e); d.setDate(d.getDate() + 1)) {
                    a.push(new Date(d));
                }
                return a;
            };
            orders.forEach(order => {
                console.log(order.from_date);
                const daylist = getDaysArray(new Date(order.from_date).setHours(0), new Date(order.to_date).setHours(0));
                daylist.map((v) => v.toISOString().slice(0, 10)).join("");
                console.log(daylist, 'daylist');
                const daylistBook = getDaysArray(new Date(from_date).setHours(0), new Date(to_date).setHours(0));
                daylistBook.map((v) => v.toISOString().slice(0, 10)).join("");
                console.log(daylistBook, 'daylistBook');
                x = daylist.map(day => day.getTime());
                y = daylistBook.map(day => day.getTime());
                console.log(x, 'xxxx');
                console.log(y, 'yyyy');
                const output = y.filter(function (obj) {
                    return x.indexOf(obj) !== -1;
                });
                console.log(output, 'output *********');
                if (output.length !== 0) {
                    next(new ApiError(`The car is taken from ${order.from_date} - ${order.to_date}`));
                }

            })

            // const getDaysArray = function(s,e) {for( a=[],d=new Date(s);d<=new Date(e);d.setDate(d.getDate()+1)){ a.push(new Date(d));}return a;};
            //
            // const daylist = getDaysArray(new Date(order.from_date).setHours(0),new Date(order.to_date).setHours(0));
            // daylist.map((v)=>v.toISOString().slice(0,10)).join(""); console.log(daylist, 'daylist');
            // const daylistBook = getDaysArray(new Date(from_date).setHours(0),new Date(to_date).setHours(0));
            // daylistBook.map((v)=>v.toISOString().slice(0,10)).join(""); console.log(daylistBook, 'daylistBook');
            // x = daylist.map(day => day.getTime()); y = daylistBook.map(day => day.getTime()); console.log(x, y)
            // const output = y.filter(function (obj) {return x.indexOf(obj) !== -1;});console.log(output, 'output *********');


            next();
        } catch (e) {
            next(e)
        }
    },
}