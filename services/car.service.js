const {Car} = require('../dataBase')

module.exports = {

    getAllCars(filter = {}) {
        return Car.find(filter)
    },

    getCarById(_id) {
        return Car.findById(_id)
    },

    getCarsByParams(filter) {
        return Car.find(filter)
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
        return Car.find({description: {$regex: key},})
    }
}