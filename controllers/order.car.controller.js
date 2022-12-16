const {orderCarService} = require("../services");
module.exports = {

    getAllOrders: async (req, res, next) => {
        try{
            const orders = await orderCarService.getCarOrders();
            res.json(orders);
        }catch (e) {
            next(e);
        }
    },

    deleteAllOrders: async (req, res, next) => {
        try{
            await orderCarService.deleteCarOrders();
            res.json('Orders deleted')
        }catch (e) {
            next(e);
        }
    },

}