const {Router} = require('express');

const carController = require("../controllers/car.controller");
const {authMldwr, carMldwr, commonMldwr} = require("../middlewares");
const {orderCarService, authService, carService, companyService, brandService} = require("../services");
const {orderCarController} = require("../controllers");
const {BRANDS} = require("../constants/regex.enum");
const {ApiError} = require("../errors");
const {carValidators} = require("../validators");
const {Car} = require("../dataBase");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: 'Images',
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname);
    }
})
const upload = multer({storage: storage}).any('files');

const carRouter = Router();

carRouter.get('/',
    // authMldwr.isAccessTokenValidCompany,
    carController.getAllCars); // everyone

carRouter.get('/:car_id', carController.getCarById); //everyone

carRouter.post('/',  // only a company with a token --done
    authMldwr.isAccessTokenValidCompany,
    // carMldwr.carBodyValid('newCarValidator'),
    carController.createCarImg);

// carRouter.post('/', (req, res) => {
//     console.log(req.body);
//     upload(req, res, async (err) => {
//         console.log(req.body, 'req body in upload');
//         console.log(req.files, 'req files');
//         const {brand} = req.body;
        // console.log(brand, 'brand in upload');
        // console.log(BRANDS.includes(brand));
        // const {_id} = req.tokenInfo.company;
        // console.log(_id, 'token company id');
        //
        // if (BRANDS.includes(brand) === false) {
        //     console.log('not includes');
        //     return next(new ApiError('Not includes this brand', 400));
        // }
        // const brand_db = brand.replace(/\s/g, '_');
        // console.log(brand_db, 'brand_db');
        // const validate = carValidators.newCarValidator.validate(req.body);
        //
        // if (validate.error) {
        //     console.log(validate.error.message, 'validate car error');
        //     return next(new ApiError(validate.error.message, 400))
        // }

        // if (!req.files) {
        //     return next(new ApiError('Upload at least one picture', 400))
        // } else {
        //     console.log(req.body, 'req body in else');
        //
        //     let arrAlbum = [];
        //     req.files.forEach(file => {
        //         console.log(file, 'iter');
        //         const image = {
        //             data: file.filename,
        //             link: `http://localhost:5000/photos/${file.filename}`
        //         }
        //         arrAlbum.push(image);
        //         console.log(arrAlbum, 'arr album');
        //     })
        //
        //     const newCar = new Car({
        //         ...req.body, brand_db, company: _id,
        //         images: arrAlbum
        //     })
        //     newCar.save()
        //         .then(() => res.send(newCar))
        //         .catch(err => console.log(err))
        //
        //     console.log(newCar, 'NEW CAR MODEL !!!!!!!!!!!!!!!!!');
        //     const companyCars = await carService.getCarsByParams({company: _id});
        //     const brandCars = await carService.getCarsByParams({brand});
        //     await companyService.updateCompany(_id, {cars: [...companyCars]});
        //     await brandService.updateBrand({brand}, {cars: [...brandCars]});
        //
        // }
//     })
// })

carRouter.delete('/:car_id',  // only a company with a token --done
    commonMldwr.validIdMldwr('car_id', 'params'),
    authMldwr.isAccessTokenValidCompany,
    carController.deleteCar);

carRouter.patch('/:car_id',  // only a company with a token --done
    commonMldwr.validIdMldwr('car_id', 'params'),
    authMldwr.isAccessTokenValidCompany,
    carMldwr.carBodyValid('updateCarValidator'),
    carController.updateCar);

carRouter.post('/:car_id/order',  // only a company with a token --done
    commonMldwr.validIdMldwr('car_id', 'params'),
    authMldwr.isAccessTokenValidUser,
    carMldwr.isCarTaken(),
    carController.orderCar);

carRouter.post('/filter/date',  // only a company with a token --done
    // commonMldwr.validIdMldwr('car_id', 'params'),
    // authMldwr.isAccessTokenValidUser,
    // carMldwr.isCarTaken(),
    // carController.orderCar,
    carMldwr.filterCarsByDates);

carRouter.post('/search/description',
    carController.searchCarByDescription
)

carRouter.delete('/', async (req, res) => {
    const result = await carService.deleteCars(); // for admin
    res.json(result);
});


module.exports = carRouter;