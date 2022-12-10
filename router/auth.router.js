const {Router} = require('express');

const {authController} = require("../controllers");
const {companyMldwr} = require("../middlewares");
const {authService} = require("../services");

const authRouter = Router();

authRouter.post('/login',
    companyMldwr.companyBodyValid('loginCompanyValidator'),
    companyMldwr.getCompanyDynamically('body', 'contact_number'),
    authController.login)

// authRouter.get('/', async (req, res) => {
//     const result = await authService.getAllAuth()
//     res.json(result);
// })

module.exports = authRouter;