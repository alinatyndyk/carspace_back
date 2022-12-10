const {Router} = require('express');
const {userController} = require("../controllers");

const userRouter = Router();

userRouter.get('/', userController.getAllUsers);

userRouter.post('/', userController.createUser);
userRouter.patch('/:user_id', userController.updateUser);
userRouter.delete('/:user_id', userController.deleteUser);

module.exports = userRouter;