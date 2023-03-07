const {Router} = require('express');

const {brandController} = require("../controllers");
const {commonMldwr, authMldwr} = require("../middlewares");

const brandRouter = Router();

brandRouter.get('/',
    brandController.getAllBrands);

brandRouter.get('/:brand_id',
    commonMldwr.validIdMldwr('brand_id', 'params'),
    brandController.getBrandById); //everyone

brandRouter.post('/',
    authMldwr.isAccessTokenValidAdmin,
    brandController.createBrand);

brandRouter.delete('/:brand_id',
    commonMldwr.validIdMldwr('brand_id', 'params'),
    authMldwr.isAccessTokenValidAdmin,
    brandController.deleteBrand);

module.exports = brandRouter;