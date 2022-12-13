const {Router} = require('express');

const {authController} = require("../controllers");
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

authRouter.post('/password/forgot',
    userMldwr.userBodyValid('userEmailValidator'),
    userMldwr.getUserDynamically('body', 'email'),
    authController.forgotPassword);

authRouter.put('/password/forgot',
    userMldwr.userBodyValid('userEmailValidator'),
    authMldwr.isActionTokenValid(FORGOT_PASSWORD),
    authMldwr.checkPreviousPassword,
    authController.setNewPasswordForgot);

//password forgot
//password/reset


authRouter.get('/company', async (req, res) => {
    const result = await authService.getAllAuthCompany();
    res.json(result);
});

authRouter.get('/user', async (req, res) => {
    const result = await authService.getAllAuthUser();
    res.json(result);
})

module.exports = authRouter;