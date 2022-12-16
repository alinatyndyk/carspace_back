const {OrderCar} = require('../dataBase')

module.exports = {
    createCarOrder(orderInfo){
        return OrderCar.create(orderInfo);
    },

    getCarOrderByParams(filter){
        return OrderCar.findOne(filter);
    },

    deleteCarOrderByParams(filter){
        return OrderCar.deleteOne(filter);
    },

    getCarOrders(){
        return OrderCar.find();
    }
}