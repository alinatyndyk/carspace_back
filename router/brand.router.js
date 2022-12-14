const {Router} = require('express');

const {brandController} = require("../controllers");
const {commonMldwr} = require("../middlewares");

const brandRouter = Router();

brandRouter.get('/',
    brandController.getAllBrands);

brandRouter.get('/:brand_id',
    commonMldwr.validIdMldwr('brand_id', 'params'),
    brandController.getBrandById); //everyone

brandRouter.post('/',
    //auth admin
    //todo unique
    brandController.createBrand);

brandRouter.delete('/:brand_id',
    //auth admin
    commonMldwr.validIdMldwr('brand_id', 'params'),
    brandController.deleteBrand);

module.exports = brandRouter;