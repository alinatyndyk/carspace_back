const {Router} = require('express');

const carController = require("../controllers/car.controller");
const {authMldwr, carMldwr, commonMldwr} = require("../middlewares");
const {orderCarService, authService, carService} = require("../services");
const {orderCarController} = require("../controllers");

const carRouter = Router();

carRouter.get('/',
    // authMldwr.isAccessTokenValidCompany,
    carController.getAllCars); // everyone

carRouter.get('/:car_id', carController.getCarById); //everyone

carRouter.post('/',  // only a company with a token --done
    authMldwr.isAccessTokenValidCompany,
    // carMldwr.carBodyValid('newCarValidator'),
    carController.createCarImg);

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

carRouter.post('/search/description',
    carController.searchCarByDescription
)

carRouter.delete('/', async (req, res) => {
    const result = await carService.deleteCars(); // for admin
    res.json(result);
});


module.exports = carRouter;