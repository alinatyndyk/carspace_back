const {orderCarService} = require("../services");
const {verifyOrderToken} = require("../services/token.service");


module.exports = {

    checkOrderTokens: async () => {
        try {
            const carOrders = await orderCarService.getCarOrders();
            console.log('cron job iteration');
            carOrders.forEach(order => {
                console.log(order._id, 'in for each', order.car_token);
                verifyOrderToken(order);
            })
        } catch (e) {
            console.log(e.message);
        }
    }
    // const a = 'a';
    // try {
    //     const carOrders = await orderCarService.getCarOrders();
    //     console.log('cron job iteration');
    //     // console.log(carOrders);
    //     carOrders.forEach(order => {
    //         console.log(order._id, 'in for each', order.car_token);
    //         return jwt.verify(order.car_token, ORDER_CAR_WORD);
    //     });
    // } catch (e) {
    //     console.log(e.message);
    //     return orderCarService.deleteCarOrderById(order._id);
    // }
}