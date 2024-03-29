const {OrderCar} = require('../dataBase')

module.exports = {
    createCarOrder(orderInfo){
        return OrderCar.create(orderInfo);
    },

    getCarOrdersByParams(filter){
        return OrderCar.find(filter).populate('user').populate('car');
    },

    getCarOrdersByParamsWithCar(filter){
        return OrderCar.find(filter).populate('car');
    },

    deleteCarOrderById(_id){
        return OrderCar.findByIdAndDelete(_id);
    },

    deleteCarOrders(filter = {}){
        return OrderCar.deleteMany(filter);
    },

    getCarOrders(){
        return OrderCar.find();
    },

    getCarOrderById(_id){
        return OrderCar.findById(_id).populate('user');
    }
}