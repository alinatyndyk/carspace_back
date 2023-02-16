const {brandService} = require("../services");
const {BRANDS} = require("./regex.enum");

module.exports = {

    regexBrand: async () => {
        const brands = await brandService.getAllBrands();
        brands.forEach(item => {
            BRANDS.push(item.brand);
            return BRANDS
        });
    },
    regexBrandPush: async (brand_name) => {
        BRANDS.push(brand_name);
        return BRANDS
    },

    regexBrandSlice: async (brand_name) => {
        BRANDS.splice(BRANDS.indexOf(brand_name), 1);
        return BRANDS
    }
}

