const {Router} = require('express');

const carController = require("../controllers/car.controller");
const {authMldwr} = require("../middlewares");

const carRouter = Router();

carRouter.get('/', carController.getAllCars); // everyone

carRouter.get('/:car_id', carController.getCarById); //everyone

carRouter.post('/',  // only a company with a token
    authMldwr.isAccessTokenValid,
    carController.createCar);

carRouter.delete('/:car_id',  // only a company with a token
    authMldwr.isAccessTokenValid,
    carController.deleteCar);

carRouter.patch('/:car_id',  // only a company with a token
    authMldwr.isAccessTokenValid,
    carController.updateCar);

module.exports = carRouter;