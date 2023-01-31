const {carService, companyService, orderCarService, tokenService, brandService} = require("../services");
const {ApiError} = require("../errors");
const {sendEmail} = require("../services/email.service");
const {ORDER_CREATION} = require("../constants/email.action.enum");
const {BRANDS} = require("../constants/regex.enum");
const multer = require("multer");
const {carValidators} = require("../validators");
const {Car} = require("../dataBase");
const {STRIPE_SECRET_KEY} = require("../configs/configs");
const storage = multer.diskStorage({
    destination: 'Images',
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname);
    }
})
const upload = multer({storage: storage}).any('files');

const Stripe = require('stripe')(STRIPE_SECRET_KEY);

module.exports = {
    getAllCars: async (req, res, next) => {
        try {
            const insidesBody = ['location', 'min_rent-time', 'vehicle_type', 'transmission', 'location', 'brand', 'engine_capacity', 'driver_included'] //TODO WRITE ALL PROPS
            const gteInsides = ['no_of_seats', 'fits_bags', 'model_year']
            const lteInsides = ['min_drivers_age'];
            const ignoreInsides = ['page', 'price_day_basis_min', 'price_day_basis_max']
            let {page} = req.query;
            if (!page) page = 1
            const skip = (page - 1) * 2;
            const all = {};
            if (req.query.price_day_basis_min && req.query.price_day_basis_max) {
                const pricesInsides = {max: req.query.price_day_basis_min, min: req.query.price_day_basis_max}
                all['price_day_basis'] = {$gt: pricesInsides.min, $lt: pricesInsides.max}
            }
            for (const [key, value] of Object.entries(req.query)) {
                if (insidesBody.includes(key)) {
                    all[key] = value;
                } else if (gteInsides.includes(key)) {
                    all[key] = {$gte: value};
                } else if (ignoreInsides.includes(key)) {
                    console.log(value, 'value');
                } else if (lteInsides.includes(key)) {
                    all[key] = {$lte: value};
                } else {
                    all[`car_features.${key}`] = value;
                }
            }
            const carsByInsides = await carService.getAllCars(all).skip(skip).limit(2);
            console.log(carsByInsides, 'cars by insides');
            console.log(carsByInsides.length);
            if (carsByInsides.length === undefined || 0) {
                return next(new ApiError('No cars with given parameters', 404))
            }
            res.json({page, cars: carsByInsides});
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
            let {page} = req.query;
            if (!page) page = 1
            const skip = (page - 1) * 2;

            const str = req.body.description.replaceAll("_", ' ').toLowerCase();
            const data = await carService.searchCarByDescription(str).skip(skip).limit(2);
            if (data.length === 0) {
                return next(new ApiError('No cars found. Try later...', 404))
            }
            res.json({page, cars: data});
        } catch (e) {
            next(e);
        }
    },

    createCarImg: async (req, res, next) => {
        upload(req, res, async (err) => {
            const {brand} = req.body;
            const {_id} = req.tokenInfo.company;

            if (BRANDS.includes(brand) === false) {
                return next(new ApiError('Not includes this brand', 400));
            }
            const brand_db = brand.replace(/\s/g, '_');
            const validate = carValidators.newCarValidator.validate(req.body);

            if (validate.error) {
                return next(new ApiError(validate.error.message, 400))
            }

            if (!req.files) {
                return next(new ApiError('Upload at least one picture', 400))
            } else {
                let arrAlbum = [];
                req.files.forEach(file => {
                    console.log(file, 'iter');
                    const image = {
                        data: file.filename,
                        link: `http://localhost:5000/photos/${file.filename}`
                    }
                    arrAlbum.push(image);
                })

                const newCar = new Car({
                    ...req.body, brand_db, company: _id,
                    images: arrAlbum
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

            const {min_drivers_age, min_rent_time, price_day_basis, company} = await carService.getCarById(car_id);

            if (min_drivers_age > age) {
                return next(new ApiError('Your age is not appropriate for this order', 400));
            }

            const fromDate = new Date(from_date).setHours(2, 0, 0, 0);
            const toDate = new Date(to_date).setHours(2, 0, 0, 0);
            const Difference_In_Time = toDate - fromDate;
            const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

            if (min_rent_time > Difference_In_Days) {
                return next(new ApiError(`The minimum time rent is ${min_rent_time} days`, 400));
            }

            const carToken = await tokenService.createCarToken({nbf: fromDate, exports: toDate}); //nbf exp


            let status, error;
            const {carId, token, amount} = req.body;
            try {
                await Stripe.charges.create({
                    source: token.id,
                    amount,
                    currency: 'usd'
                })
                status = 'successful'
            } catch (e) {
                console.log(e, 'error');
                status = 'failure'
            }

            const order = await orderCarService.createCarOrder({
                user: _id,
                company,
                car: car_id,
                car_token: carToken,
                from_date: fromDate,
                to_date: toDate,
                Difference_In_Days
            });
            await sendEmail(email, ORDER_CREATION, {user_id: _id, car_id});

            res.json(order);
        } catch (e) {
            next(e);
        }
    },
}