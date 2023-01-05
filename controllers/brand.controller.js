const {brandService} = require("../services");
const {regexBrandPush, regexBrandSlice, regexBrand} = require("../constants/car.valid");
const {BRANDS} = require("../constants/regex.enum");

const multer = require("multer");
const storage = multer.diskStorage({
    destination: 'Images',
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname);
    }
})
const upload = multer({storage: storage}).single('testImage');
//todo brand logo
module.exports = {
    getAllBrands: async (req, res, next) => {
        try {
            const brands = await brandService.getAllBrands();
            console.log(BRANDS, "BARNDS");
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
            const brand = await brandService.createBrand({...req.body, brand_db});
            await regexBrandPush(carBrand);
            //brand validtor
            res.json(brand);
        } catch (e) {
            next(e);
        }
    },

    deleteBrand: async (req, res, next) => {
        try {
            const {brand_id} = req.params;
            const item = await brandService.getBrandById(brand_id);
            console.log(item, 'item');
            await regexBrandSlice(item.brand);
            const brandToDelete = await brandService.deleteBrand({_id: brand_id});
            res.json(brandToDelete);
        } catch (e) {
            next(e);
        }
    },
}