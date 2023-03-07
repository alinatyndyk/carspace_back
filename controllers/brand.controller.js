const {brandService} = require("../services");
const {regexBrandPush, regexBrandSlice} = require("../constants/car.valid");
const {ApiError} = require("../errors");
module.exports = {
    getAllBrands: async (req, res, next) => {
        try {
            const brands = await brandService.getAllBrands();
            res.json(brands);
        } catch (e) {
            next(e);
        }
    },

    getBrandById: async (req, res, next) => {
        try {
            const {brand_id} = req.params;
            const brand = await brandService.getBrandById(brand_id);
            res.json(brand);
        } catch (e) {
            next(e);
        }
    },

    createBrand: async (req, res, next) => {
        try {
            const {brand: carBrand} = req.body;
            const brand_db = carBrand.replace(/\s/g, '_');
            const brands = await brandService.getOneByParams({brand: carBrand.toUpperCase()});
            if(brands){
                throw new ApiError('This brand already exists', 400)
            }
            const brand = await brandService.createBrand({brand: carBrand.toUpperCase(), brand_db});
            await regexBrandPush(carBrand);
            res.json(brand);
        } catch (e) {
            next(e);
        }
    },

    deleteBrand: async (req, res, next) => {
        try {
            const {brand_id} = req.params;
            const item = await brandService.getBrandById(brand_id);
            await regexBrandSlice(item.brand);
            const brandToDelete = await brandService.deleteBrand({_id: brand_id});

            res.json(brandToDelete);
        } catch (e) {
            next(e);
        }
    },
}