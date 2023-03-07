const {Router} = require('express');

const carController = require("../controllers/car.controller");
const {authMldwr, carMldwr, commonMldwr} = require("../middlewares");
const {carService, orderCarService} = require("../services");

const carRouter = Router();

carRouter.get('/',
    carController.getAllCars); // everyone

carRouter.get('/:car_id', carController.getCarById); //everyone

carRouter.post('/',  // only a company with a token --done
    authMldwr.isAccessTokenValidCompany,
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

carRouter.post('/filter/date',  // only a company with a token --done
    carMldwr.filterCarsByDates);

carRouter.post('/search/description',
    carController.searchCarByDescription
)

carRouter.delete('/', authMldwr.isAccessTokenValidAdmin, async (req, res) => {
    const result = await carService.deleteCars(); // for admin
    res.json(result);
});

carRouter.delete('/delete/orders', authMldwr.isAccessTokenValidAdmin, async (req, res) => {
    const result = await orderCarService.deleteCarOrders(); // for admin
    res.json(result);
});


module.exports = carRouter;