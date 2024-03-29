const {carValidators} = require("../validators");
const {ApiError} = require("../errors");
const {carService, orderCarService} = require("../services");

module.exports = {
    carBodyValid: (validatorType) => async (req, res, next) => {
        try {
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

            const fromDate = new Date(from_date).getTime();
            const toDate = new Date(to_date).getTime();

            if(fromDate < new Date().getTime()){
                next(new ApiError('The starting date must start from today'))
            }
            if(toDate < fromDate){
                next(new ApiError('The ending date must be greater than the starting date'))
            }

            const Difference_In_Time = new Date(toDate).getTime() - new Date(fromDate).getTime();
            const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

            if(Difference_In_Days > 120){
                next(new ApiError('You are not allowed to make orders for more than 4 month', 400))
            }

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

            let {page} = req.query;
            let {page: pageBody} = req.body;

            if (!page) {
                page = pageBody;
                if (!pageBody) page = 1;
            }
            const limit = 2;

            const fromDate = new Date(from_date).getTime();
            const toDate = new Date(to_date).getTime();
            const Today = new Date().getTime();

            if (Today > fromDate) {
                return next(new ApiError('Choose a date after today', 409))
            }
            if (toDate < fromDate) {
                return next(new ApiError('Choose a date after the starting date', 409))
            }

            const str = req.body.description.replaceAll("_", ' ').toLowerCase();

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

                if (!output || !output.length) {
                    availableCars.push(car);
                }
            }
            const finish = page * limit;
            const start = finish - limit;
            const slicedCars = availableCars.slice(start, finish);

            res.json(slicedCars);
        } catch (e) {
            next(e)
        }
    },
}