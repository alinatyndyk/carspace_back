const {orderCarService} = require("../services");
const {sendTodayOrder} = require("../services/email.service");
module.exports = {

    sendTodayOrderEmail: async () => {
        try {
            const today = new Date().setHours(2, 0, 0, 0);
            const ordersToday = await orderCarService.getCarOrdersByParams({from_date: today});
            ordersToday.forEach(order => {
                sendTodayOrder(order.user.email, {
                    order_id: order._id,
                    car_id: order.car,
                    user_id: order.user._id,
                    userName: order.user.name
                });
            })
        } catch (e) {
        }
    }
}