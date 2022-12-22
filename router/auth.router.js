const {Router} = require('express');

const {authController, orderCarController} = require("../controllers");
const {companyMldwr, authMldwr, userMldwr} = require("../middlewares");
const {authService} = require("../services");
const {FORGOT_PASSWORD} = require("../constants/token.type.enum");

const authRouter = Router();

authRouter.post('/user/login',
    userMldwr.userBodyValid('loginUserValidator'),
    userMldwr.getUserDynamically('body', 'email'),
    authController.loginUser
);

authRouter.post('/user/logout',
    authMldwr.isAccessTokenValidUser,
    authController.logoutUser
);

authRouter.post('/user/refresh',
    authMldwr.isRefreshTokenValidUser,
    authController.refreshUser
);

//_______________________________________________________________

authRouter.post('/company/login',
    companyMldwr.companyBodyValid('loginCompanyValidator'),
    companyMldwr.getCompanyDynamically('body', 'contact_number'),
    authController.loginCompany
);

authRouter.post('/company/logout',
    authMldwr.isAccessTokenValidCompany,
    authController.logoutCompany
);

authRouter.post('/company/refresh',
    authMldwr.isRefreshTokenValidCompany,
    authController.refreshCompany
);

//______________________________________________________________

authRouter.post('user/password/forgot',
    userMldwr.userBodyValid('userEmailValidator'),
    userMldwr.getUserDynamically('body', 'email'),
    authController.forgotPassword);

authRouter.put('user/password/reset',
    userMldwr.userBodyValid('userEmailValidator'),
    authMldwr.isActionTokenValid(FORGOT_PASSWORD),
    authMldwr.checkPreviousPassword,
    authController.setNewPasswordForgot);

//password forgot
//password/reset

//________________________________________________________________

authRouter.get('/company', async (req, res) => {
    const result = await authService.getAllAuthCompany(); // for admin
    res.json(result);
});

authRouter.get('/user', async (req, res) => {
    const result = await authService.getAllAuthUser(); // for admin
    res.json(result);
});

//_______________________________________________________________

authRouter.get('/orders/all', //for admin
    orderCarController.getAllOrders
);

authRouter.delete('/orders',
    orderCarController.deleteAllOrders
); // for admin

authRouter.get('/orders/today', // only for user --done
    // authMldwr.isAccessTokenValidUser, // token company
    orderCarController.getAllOrdersToday
);

authRouter.get('/orders', // only for user --done
    authMldwr.isAccessTokenValidUser,
    orderCarController.getAllUserOrders
);

authRouter.get('/orders/:order_id', // only for user --done
    authMldwr.isAccessTokenValidUser,
    orderCarController.getUserOrderById
);

authRouter.delete('/orders/:order_id', // only for user --done
    authMldwr.isAccessTokenValidUser,
    orderCarController.deleteUserOrderById
);

module.exports = authRouter;