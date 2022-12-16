const {OrderCar} = require('../dataBase')

module.exports = {
    createCarOrder(orderInfo){
        return OrderCar.create(orderInfo);
    },

    getCarOrderByParams(filter){
        return OrderCar.findOne(filter);
    },

    deleteCarOrderById(filter){
        return OrderCar.findByIdAndDelete(filter);
    },

    deleteCarOrderByParams(filter){
        return OrderCar.deleteOne(filter);
    },

    deleteCarOrders(filter = {}){
        return OrderCar.deleteMany(filter);
    },

    getCarOrders(){
        return OrderCar.find();
    }
}