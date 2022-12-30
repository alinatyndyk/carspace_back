const {Router} = require('express');
const {userController} = require("../controllers");
const {userMldwr, commonMldwr, authMldwr} = require("../middlewares");
const {Image_model, User} = require("../dataBase");


const userRouter = Router();

userRouter.get('/',
    // admin token
    userController.getAllUsers); // only admin

userRouter.get('/:user_id',
    commonMldwr.validIdMldwr('user_id', 'params'),
    userMldwr.isUserPresent(),
    // todo admin token
    userController.getUserById); // only admin

// userRouter.post('/',
//     userMldwr.userBodyValid('newUserValidator'),
//     userMldwr.uniqueUserEmail,
//     userController.createUserImg,
// ); // everyone


// const {email, name, password} = req.body;
// console.log('crate user', email, name, password);
// const hashPassword = await tokenService.hashPassword(req.body.password);
// await sendEmail(email, CREATE_USER, {userName: name});
// console.log(name);
//---------------------------------------------------------------------------------
const multer = require('multer');
const {userValidators} = require("../validators");
const {ApiError} = require("../errors");
const {tokenService} = require("../services");
const {sendEmail} = require("../services/email.service");
const {CREATE_USER} = require("../constants/email.action.enum");
const storage = multer.diskStorage({
    destination: 'Images',
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname);
    }
})
const upload = multer({storage: storage}).single('testImage');


userRouter.post('/',(req, res, next) => {
    upload(req, res, async (err) => {

        const validate = userValidators.newUserValidator.validate(req.body);

        if (validate.error) {
            console.log('validate error', validate.error.message);
            return next(new ApiError(validate.error.message, 400))
        }

        console.log(req.body, 'req body img');
        console.log(req.file, 'req file');
        const {email, name} = req.body;
        const hashPassword = await tokenService.hashPassword(req.body.password);
        await sendEmail(email, CREATE_USER, {userName: name});
        if (!req.file) {
            return next( new ApiError('Upload at least one picture', 400))
        } else {
            const newImage = new User({
                ...req.body, password: hashPassword,
                image: {
                    data: req.file.filename
                }
            })
            newImage.save()
                .then(() => res.send('successfully uploaded'))
                .catch(err => console.log(err))
        }
    })
})

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

module.exports = userRouter;