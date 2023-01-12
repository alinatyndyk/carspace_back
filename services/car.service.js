const {Car} = require('../dataBase')

module.exports = {

    // getAllCars(filter = {}) {
    //     return Car.find(filter)
    // },

    getAllCars(filter = {}) {
        console.log(filter, 'filter service');
        return Car.find(filter)
    },


    // db.collection.find({
    //     "contractInfo.userid": "yourid"
    // })

    getCarById(_id) {
        return Car.findById(_id)
    },

    getCarsByParams(filter) {
        return Car.find(filter)
    },

    createCar(carObject) {
        return Car.create(carObject)
    },

    updateCar(_id, newCarObject) {
        return Car.findByIdAndUpdate(_id, newCarObject, {new: true})
    },

    deleteCar(_id) {
        return Car.findByIdAndDelete(_id)
    },

    deleteCars(filter = {}) {
        return Car.deleteMany(filter)
    },

    searchCarByDescription(key = {}) {
        // return Car.find(key)
        return Car.find({description: {$regex: key},})
    }
}