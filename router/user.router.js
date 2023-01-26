const {Router} = require('express');
const {userController} = require("../controllers");
const {userMldwr, commonMldwr, authMldwr} = require("../middlewares");
const {User, Album} = require("../dataBase");
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

const userRouter = Router();

userRouter.get('/',
    // admin token
    userController.getAllUsers); // only admin

userRouter.get('/:user_id',
    commonMldwr.validIdMldwr('user_id', 'params'),
    userMldwr.isUserPresent(),
    // admin token
    userController.getUserById); // only admin
//---------------------------------------------------------------------------------
const upload = multer({storage: storage}).single('testImage');

userRouter.post('/', (req, res, next) => {
    upload(req, res, async (err) => {

        const validate = userValidators.newUserValidator.validate(req.body);

        if (validate.error) {
            console.log('validate error', validate.error.message);
            return next(new ApiError(validate.error.message, 400))
        }

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
    upload(req, res, (err) => {
        if (!req.files) {
            console.log(err);
            throw new ApiError('Upload at least one picture', 400)
        } else {
            let arrAlbum = [];
            req.files.forEach(file => {
                const image = {
                    data: file.filename,
                    link: `http://localhost:5000/photos/${file.filename}`
                }
                arrAlbum.push(image);
            })
            const NewAlbum = new Album({
                images: arrAlbum
            })
            NewAlbum.save()
                .then(() => res.send(NewAlbum))
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
//-------------------------------------------------------------
userRouter.delete('/', async (req, res) => {
    await userService.deleteUsers();
    res.send('Users are empty');
})

module.exports = userRouter;