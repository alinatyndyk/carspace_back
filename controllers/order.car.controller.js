const {orderCarService} = require("../services");
const {ApiError} = require("../errors");
const {sendEmail} = require("../services/email.service");
const {ORDER_CANCEL} = require("../constants/email.action.enum");
module.exports = {

    getAllOrders: async (req, res, next) => {
        try {
            const orders = await orderCarService.getCarOrders();
            res.json(orders);
        } catch (e) {
            next(e);
        }
    },

    deleteAllOrders: async (req, res, next) => {
        try {
            await orderCarService.deleteCarOrders();
            res.json('Orders deleted')
        } catch (e) {
            next(e);
        }
    },

    getAllUserOrders: async (req, res, next) => {
        try {
            const {_id} = req.tokenInfo.user;
            const orders = await orderCarService.getCarOrdersByParamsWithCar({user: _id});
            res.json(orders);
        } catch (e) {
            next(e);
        }
    },

    getAllCompanyOrders: async (req, res, next) => {
        try {
            const {_id} = req.tokenInfo.company;
            console.log(_id, 'compnay id or obg');
            const orders = await orderCarService.getCarOrdersByParams({company: _id});
            res.json(orders);
        } catch (e) {
            next(e);
        }
    },

    getUserOrderById: async (req, res, next) => {
        try {
            const {order_id} = req.params;
            const {_id} = req.tokenInfo.user;
            console.log(req.tokenInfo, 'controller token in');

            const orderToFetch = await orderCarService.getCarOrderById(order_id);

            console.log(_id.toString(), orderToFetch.user.toString());

            if (_id.toString() !== orderToFetch.user.toString()) {
                return next(new ApiError('Access token doesnt belong to the order you are trying to get'));
            }

            const orders = await orderCarService.getCarOrderById(order_id);
            res.json(orders);
        } catch (e) {
            next(e);
        }
    },

    getCompanyOrderById: async (req, res, next) => {
        try {
            const {order_id} = req.params;
            console.log(order_id, 'order id');
            const {_id} = req.tokenInfo.company;
            console.log(_id, 'controller token in');

            const orderToFetch = await orderCarService.getCarOrderById(order_id);
            console.log(orderToFetch, 'order to fetch');

            console.log(_id.toString(), orderToFetch.company.toString());

            if (_id.toString() !== orderToFetch.company.toString()) {
                return next(new ApiError('Access token doesnt belong to the order you are trying to get'));
            }

            const orders = await orderCarService.getCarOrderById(order_id);
            res.json(orders);
        } catch (e) {
            next(e);
        }
    },

    getAllOrdersToday: async (req, res, next) => {
        try {
            const today = new Date().setHours(2, 0, 0, 0);
            console.log(today);
            const {_id} = req.tokenInfo.company;
            console.log(_id.toString());
            const orders = await orderCarService.getCarOrdersByParams({from_date: today, company: _id});
            res.json(orders);
        } catch (e) {
            next(e);
        }
    },

    deleteUserOrderById: async (req, res, next) => {
        try {
            const {order_id} = req.params;
            const {_id, email, name} = req.tokenInfo.user;

            const orderToDelete = await orderCarService.getCarOrderById(order_id);
            console.log(_id.toString(), orderToDelete.user.toString());

            if (_id.toString() !== orderToDelete.user.toString()) {
                return next(new ApiError('Access token doesnt belong to the order you are trying to delete'));
            }

            await sendEmail(email, ORDER_CANCEL, {userName: name, user_id: _id, order_id});

            const order = await orderCarService.deleteCarOrderById(order_id);
            res.json(order);
        } catch (e) {
            next(e);
        }
    },
}
