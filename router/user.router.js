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

//---------------------------------------------------------------------------------
const multer = require('multer');
const storage = multer.diskStorage({
    destination: 'Images',
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname);
    }
})
const upload = multer({storage: storage}).single('testImage');


userRouter.post('/',(req, res) => {
    upload(req, res, (err) => {
        console.log(req.body, 'req body img');
        console.log(req.file, 'req file');
        if (err) {
            console.log(err);
        } else {
            const newImage = new User({
                ...req.body,
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