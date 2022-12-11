const {Router} = require('express');
const {userController} = require("../controllers");
const {userMldwr, commonMldwr, authMldwr} = require("../middlewares");


const userRouter = Router();

userRouter.get('/',
    // admin token
    userController.getAllUsers); // only admin

userRouter.get('/:user_id',
    commonMldwr.validIdMldwr('user_Id', 'params'),
    userMldwr.isUserPresent(),
    // todo admin token
    userController.getUserById); // only admin

userRouter.post('/',
    userMldwr.userBodyValid('newUserValidator'),
    userMldwr.uniqueUserEmail,
    userController.createUser); // everyone

userRouter.patch('/:user_id',
    commonMldwr.validIdMldwr('user_Id', 'params'),
    userMldwr.userBodyValid('updateUserValidator'),
    userMldwr.isUserPresent(),
    authMldwr.isAccessTokenValidUser,
    userMldwr.uniqueUserEmail,
    userController.updateUser); //only with a users token

userRouter.delete('/:user_id',
    commonMldwr.validIdMldwr('user_Id', 'params'),
    userMldwr.isUserPresent(),
    authMldwr.isAccessTokenValidUser,
    userController.deleteUser); //only with a users token

module.exports = userRouter;