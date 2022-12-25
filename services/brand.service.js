const {Brand, Company} = require('../dataBase');

module.exports = {

    getAllBrands(){
        return Brand.find();
    },

    getBrandById(id){
        return Brand.findById(id);
    },

    getOneByParams(filter) {
        return Brand.findOne(filter);
    },

    createBrand(brandObject){
        return Brand.create(brandObject);
    },

    updateBrand(filter, newBrandObject){
        return Brand.updateOne(filter, newBrandObject, {new: true});
    },

    deleteBrand(filter){
        return Brand.deleteOne(filter);
    },
}