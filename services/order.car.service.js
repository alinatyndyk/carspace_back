const {OrderCar} = require('../dataBase')

module.exports = {
    createCarOrder(orderInfo){
        return OrderCar.create(orderInfo);
    },

    getCarOrderByParams(filter){
        return OrderCar.findById(filter);
    },

    getCarOrders(){
        return OrderCar.find();
    }
}