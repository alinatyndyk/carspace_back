const {Car} = require('../dataBase')

module.exports = {

    getAllCars() {
        return Car.find()
    },

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
}