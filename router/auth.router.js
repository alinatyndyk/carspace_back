const {Router} = require('express');

const {authController} = require("../controllers");
const {companyMldwr, authMldwr} = require("../middlewares");
const {authService} = require("../services");

const authRouter = Router();

authRouter.post('/user/login',
    companyMldwr.companyBodyValid('loginCompanyValidator'),
    companyMldwr.getCompanyDynamically('body', 'contact_number'),
    authController.loginUser
);

authRouter.post('/user/logout',
    authMldwr.isAccessTokenValidUser,
    authController.logoutUser
);

authRouter.post('/company/refresh',
    authMldwr.isRefreshTokenValidCompany,
    authController.refreshCompany
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

//password forgot
//password/reset


authRouter.get('/', async (req, res) => {
    const result = await authService.getAllAuth()
    res.json(result);
})

module.exports = authRouter;