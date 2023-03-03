const {Router} = require('express');
const {userController} = require("../controllers");
const {userMldwr, commonMldwr, authMldwr} = require("../middlewares");
const {userService} = require("../services");
const multer = require('multer');
const {createUserImg} = require("../controllers/user.controller");
const {isUserNewAdmin} = require("../middlewares/user.middlewares");

const storage = multer.diskStorage({
    destination: 'Images',
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname);
    }
})
const upload = multer({storage: storage}).single('testImage');

const userRouter = Router();

userRouter.get('/',
    authMldwr.isAccessTokenValidAdmin,
    userController.getAllUsers); // only admin

userRouter.get('/:user_id',
    commonMldwr.validIdMldwr('user_id', 'params'),
    userMldwr.isUserPresent(),
    authMldwr.isAccessTokenValidAdminOrUser,
    userController.getUserById); // only admin

userRouter.post('/', createUserImg);

userRouter.patch('/:user_id',
    commonMldwr.validIdMldwr('user_id', 'params'),
    userMldwr.userBodyValid('updateUserValidator'),
    userMldwr.isUserPresent(),
    authMldwr.isAccessTokenValidUser,
    userMldwr.uniqueUserEmail,
    userController.updateUser); //only with a users token --done

userRouter.delete('/:user_id',
    commonMldwr.validIdMldwr('user_id', 'params'),
    userMldwr.isUserPresent(),
    authMldwr.isAccessTokenValidUser,
    userController.deleteUser); //only with a users token --done


userRouter.delete('/', async (req, res) => {
    await userService.deleteUsers();
    res.send('Users are empty');
})

module.exports = userRouter;