const {orderCarService} = require("../services");
const {verifyOrderToken} = require("../services/token.service");


module.exports = {

    checkOrderTokens: async () => {
        try {
            const carOrders = await orderCarService.getCarOrders();
            carOrders.forEach(order => {
                console.log(order._id, 'in for each', order.car_token);
                verifyOrderToken(order);
            })
        } catch (e) {
            console.log(e.message);
        }
    }
}