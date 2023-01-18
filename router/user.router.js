const {Router} = require('express');
const {userController} = require("../controllers");
const {userMldwr, commonMldwr, authMldwr} = require("../middlewares");
const {Image_model, User, Album} = require("../dataBase");


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
const {userValidators} = require("../validators");
const {ApiError} = require("../errors");
const {tokenService, userService} = require("../services");
const {sendEmail} = require("../services/email.service");
const {CREATE_USER} = require("../constants/email.action.enum");
const multer = require('multer');
const storage = multer.diskStorage({
    destination: 'Images',
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname);
    }
})
// const upload = multer({storage: storage}).single('testImage');
const upload = multer({storage: storage}).any('files');


userRouter.post('/', (req, res, next) => {
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
            return next(new ApiError('Upload at least one picture', 400))
        } else {
            const newImage = new User({
                ...req.body, password: hashPassword,
                image: {
                    data: req.file.filename,
                    link: `http://localhost:5000/photos/${req.file.filename}`
                }
            })
            newImage.save()
                .then(() => res.send('successfully uploaded'))
                .catch(err => console.log(err))
        }
    })
})

userRouter.get('/get/album', async (req, res) => {
    const result = await Album.find();
    res.json(result);
})
userRouter.post('/album', (req, res, next) => {
    console.log(req.body, 'req body');
    upload(req, res, (err) => {
        console.log('**************************');
    console.log(req.files, 'req files');
    console.log(req.body, 'req files');
        if(!req.files) {
            console.log(err);
             throw new ApiError('Upload at least one picture', 400)
        } else {
            let arrAlbum = [];
            req.files.forEach(file => {
                console.log(file, 'iter');
                    const image = {
                        data: file.filename,
                        link: `http://localhost:5000/photos/${file.filename}`
                    }
                arrAlbum.push(image);
                console.log(arrAlbum, 'arr album');
            })
            const NewAlbum = new Album({
                images: arrAlbum
            })
            NewAlbum.save()
                .then(() => res.send(NewAlbum))
                .catch(err => console.log(err))
            console.log(NewAlbum, 'NEW ALBUM MODEL !!!!!!!!!!!!!!!!!');
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
//-------------------------------------------------------------
userRouter.delete('/', async (req, res) => {
    await userService.deleteUsers();
    res.send('Users are empty');
})

module.exports = userRouter;