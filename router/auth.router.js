const {Router} = require('express');

const {authController, orderCarController} = require("../controllers");
const {companyMldwr, authMldwr, userMldwr, commonMldwr, adminMldwr} = require("../middlewares");
const {authService} = require("../services");
const {FORGOT_PASSWORD_USER, FORGOT_PASSWORD_COMPANY} = require("../constants/token.type.enum");

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

//--------------------------------------------------------------

//todo admin forgot pass

authRouter.post('/admin/login',
    adminMldwr.adminBodyValid('loginAdminValidator'),
    adminMldwr.getAdminDynamically('body', 'contact_number'),
    authController.loginAdmin
);

authRouter.post('/admin/logout',
    authMldwr.isAccessTokenValidAdmin,
    authController.logoutAdmin
);

authRouter.post('/admin/refresh',
    authMldwr.isRefreshTokenValidAdmin,
    authController.refreshAdmin
);

//______________________________________________________________

//todo pass reset no forgot

authRouter.post('/password_forgot/user',
    userMldwr.userBodyValid('userEmailValidator'),
    userMldwr.getUserDynamically('body', 'email'),
    authController.forgotPasswordUser);

authRouter.put('/password_reset/user',
    commonMldwr.isBodyValid('PasswordValidator'),
    authMldwr.isActionTokenValid(FORGOT_PASSWORD_USER),
    authMldwr.checkPreviousPasswordUser,
    authController.setNewPasswordForgotUser);

authRouter.post('/password_forgot/company',
    commonMldwr.isBodyValid('NumberValidator'),
    companyMldwr.getCompanyDynamically('body', 'contact_number'),
    authController.forgotPasswordCompany);

authRouter.put('/password_reset/company',
    commonMldwr.isBodyValid('PasswordValidator'),
    authMldwr.isActionTokenValid(FORGOT_PASSWORD_COMPANY),
    authMldwr.checkPreviousPasswordCompany,
    authController.setNewPasswordForgotCompany);

//________________________________________________________________

authRouter.get('/company', async (req, res) => {
    const result = await authService.getAllAuthCompany(); // for admin
    res.json(result);
});

authRouter.get('/user', async (req, res) => {
    const result = await authService.getAllAuthUser(); // for admin
    res.json(result);
}); //todo remove

//_______________________________________________________________

authRouter.get('/orders/all', //for admin
    orderCarController.getAllOrders
);

authRouter.delete('/orders/delete',
    orderCarController.deleteAllOrders
); // for admin

authRouter.get('/orders/today', // only for user --done
    authMldwr.isAccessTokenValidCompany, // token company
    orderCarController.getAllOrdersToday
);

authRouter.get('/orders/user', // only for user --done
    authMldwr.isAccessTokenValidUser,
    orderCarController.getAllUserOrders
);

authRouter.get('/orders/company', // only for company --done
    authMldwr.isAccessTokenValidCompany,
    orderCarController.getAllCompanyOrders
);

authRouter.get('/user-orders/:order_id', // only for user --done
    // authMldwr.isAccessTokenValidUser,
    authMldwr.isAccessTokenValidUser,
    orderCarController.getUserOrderById
);

authRouter.get('/company-orders/:order_id', // only for user --done
    // authMldwr.isAccessTokenValidUser,
    authMldwr.isAccessTokenValidCompany,
    orderCarController.getCompanyOrderById
);

authRouter.delete('/orders/:order_id', // only for user --done
    authMldwr.isAccessTokenValidUser,
    orderCarController.deleteUserOrderById
);

module.exports = authRouter;