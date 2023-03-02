const {Router} = require('express');
const {adminController} = require("../controllers");
const {userMldwr, commonMldwr, authMldwr, adminMldwr} = require("../middlewares");
const {adminService} = require("../services");

const adminRouter = Router();

adminRouter.get('/',
    authMldwr.isAccessTokenValidAdmin,
    adminController.getAllAdmins); // only admin

adminRouter.get('/:admin_id',
    commonMldwr.validIdMldwr('admin_id', 'params'),
    authMldwr.isAccessTokenValidAdmin,
    adminController.getAdminById); // only admin

adminRouter.post('/verify',
    userMldwr.userBodyValid('userEmailValidator'),
    adminMldwr.uniqueAdminEmail,
    authMldwr.isAccessTokenValidAdmin,
    adminController.createAdminVerify
);

adminRouter.post('/',
    userMldwr.userBodyValid('newUserValidator'),
    adminMldwr.uniqueAdminEmail,
    authMldwr.isVerificationStringValid,
    adminController.createAdmin
);

adminRouter.patch('/:admin_id',
    commonMldwr.validIdMldwr('admin_id', 'params'),
    userMldwr.userBodyValid('updateUserValidator'),
    adminMldwr.isAdminPresent(),
    authMldwr.isAccessTokenValidAdmin,
    adminMldwr.uniqueAdminEmail,
    adminController.updateAdmin); //only with a users token --done

adminRouter.delete('/:admin_id',
    commonMldwr.validIdMldwr('admin_id', 'params'),
    adminMldwr.isAdminPresent(),
    authMldwr.isAccessTokenValidAdmin,
    adminController.deleteAdmin); //only with a users token --done


adminRouter.delete('/', async (req, res) => {
    await adminService.deleteAdmins();
    res.send('Admins are empty');
})

module.exports = adminRouter;