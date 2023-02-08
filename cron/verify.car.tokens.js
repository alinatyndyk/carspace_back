const {orderCarService} = require("../services");
const {verifyOrderToken} = require("../services/token.service");


module.exports = {

    checkOrderTokens: async () => {
        try {
            const carOrders = await orderCarService.getCarOrders();
            carOrders.forEach(order => {
                verifyOrderToken(order);
            })
        } catch (e) {
            console.log(e.message);
        }
    }
}