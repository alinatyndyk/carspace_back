const {carService, companyService, orderCarService, tokenService, brandService} = require("../services");
const {ApiError} = require("../errors");
const {sendEmail} = require("../services/email.service");
const {ORDER_CREATION} = require("../constants/email.action.enum");
const {BRANDS} = require("../constants/regex.enum");
const multer = require("multer");
const {carValidators} = require("../validators");
const {Car} = require("../dataBase");
const {carMldwr} = require("../middlewares");
const storage = multer.diskStorage({
    destination: 'Images',
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname);
    }
})
const upload = multer({storage: storage}).single('testImage');

// const stripe = require('stripe')('sk_test_51MIX9gIAfGNWX8Hhl3mH4IFJladHRo1ErYUQv2ZEIWdfJIwKXvk5zHwOGUrntdnmJz7af89NUZFm94dVRYV00fRl00gqg3UAPA');

module.exports = {
    getAllCars: async (req, res, next) => {
        try {
            // const {access_token, refresh_token} = req.tokenInfo;
            // console.log(access_token, refresh_token, 'tokens in get all');
            const cars = await carService.getAllCars(req.query);
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

    searchCarByDescription: async (req, res, next) => {
        try {
            const {search} = req.body;
            console.log(req.body);
            const data = await carService.searchCarByDescription(search);
            if(data.length === 0){
                return next(new ApiError('No cars found. Try later...', 400))
            }
            res.json(data);
        } catch (e) {
            next(e);
        }
    },

    createCar: async (req, res, next) => {
        try {
            const {_id} = req.tokenInfo.company;
            const {brand} = req.body;

            console.log(BRANDS.includes(brand));

            if (BRANDS.includes(brand) === false) {
                console.log('not includes');
                return next(new ApiError('Not includes this brand', 400));
            }

            const brand_db = brand.replace(/\s/g, '_');
            const car = await carService.createCar({...req.body, company: _id, brand_db});
            const companyCars = await carService.getCarsByParams({company: _id});
            const brandCars = await carService.getCarsByParams({brand});
            await companyService.updateCompany(_id, {cars: [...companyCars]});
            await brandService.updateBrand({brand}, {cars: [...brandCars]});
            res.json(car);
        } catch (e) {
            next(e);
        }
    },

    createCarImg: async (req, res, next) => {
        upload(req, res, async (err) => {
            console.log(req.body, 'req body in upload');
            console.log(req.file, 'req file');
            const {brand} = req.body;
            console.log(brand, 'brand in upload');
            console.log(BRANDS.includes(brand));
            const {_id} = req.tokenInfo.company;
            console.log(_id, 'token company id');

            if (BRANDS.includes(brand) === false) {
                console.log('not includes');
                return next(new ApiError('Not includes this brand', 400));
            }
            const brand_db = brand.replace(/\s/g, '_');
            console.log(brand_db, 'brand_db');
            const validate = carValidators.newCarValidator.validate(req.body);

            if (validate.error) {
                console.log(validate.error.message, 'validate car error');
                return next(new ApiError(validate.error.message, 400))
            }

            if (!req.file) {
                return next(new ApiError('Upload at least one picture', 400))
            } else {
                console.log(req.body, 'req body in else');
                const newCar = new Car({
                    ...req.body, brand_db, company: _id,
                    image: {
                        data: req.file.filename,
                        link: `http://localhost:5000/photos/${req.file.filename}`
                    }
                })
                newCar.save()
                    .then(() => res.send(newCar))
                    .catch(err => console.log(err))

                const companyCars = await carService.getCarsByParams({company: _id});
                const brandCars = await carService.getCarsByParams({brand});
                await companyService.updateCompany(_id, {cars: [...companyCars]});
                await brandService.updateBrand({brand}, {cars: [...brandCars]});

            }
        })
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
            const {_id, email, age} = req.tokenInfo.user; // objectId of tokens user
            const {car_id} = req.params; //string
            const {from_date, to_date} = req.body;
            console.log(from_date, to_date, 'time period-----------------------1st');

            const {min_drivers_age, min_rent_time, price_day_basis, company} = await carService.getCarById(car_id);
            console.log(price_day_basis, 'price*************************');


            if (min_drivers_age > age) {
                return next(new ApiError('Your age is not appropriate for this order', 400));
            }
            console.log(min_drivers_age, age, 'ages****************************');

            const fromDate = new Date(from_date).setHours(2, 0, 0, 0);
            const toDate = new Date(to_date).setHours(2, 0, 0, 0);
            const Difference_In_Time = toDate - fromDate;
            const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            console.log(fromDate, toDate, Difference_In_Days);

            if (min_rent_time > Difference_In_Days) {
                return next(new ApiError(`The minimum time rent is ${min_rent_time} days`, 400));
            }
            console.log(min_rent_time, Difference_In_Days, 'rent*********************************')

            const carToken = await tokenService.createCarToken({nbf: fromDate, exports: toDate}); //nbf exp


//-------------------------------------------------------------------------------------------------------

            // Create a PaymentIntent with the order amount and currency
            // const paymentIntent = await stripe.paymentIntents.create({
            //     amount: price_day_basis,
            //     currency: "usd",
            //     automatic_payment_methods: {
            //         enabled: true,
            //     },
            // });
            //
            // res.send({
            //     clientSecret: paymentIntent.client_secret,
            // });

            //---------------------------------------------------------------------


            await sendEmail(email, ORDER_CREATION, {user_id: _id, car_id});

            const order = await orderCarService.createCarOrder({
                user: _id,
                company,
                car: car_id,
                car_token: carToken,
                from_date: fromDate,
                to_date: toDate,
                Difference_In_Days
            });

            res.json(order);
        } catch (e) {
            next(e);
        }
    },
}