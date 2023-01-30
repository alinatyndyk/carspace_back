const {userService, tokenService} = require("../services");
const {ApiError} = require("../errors");
const {DELETE_USER, CREATE_USER} = require("../constants/email.action.enum");
const {sendEmail} = require("../services/email.service");
const {User} = require("../dataBase");
const multer = require('multer');
const {Error} = require("mongoose");
const {userValidators} = require("../validators");

const storage = multer.diskStorage({
    destination: 'Images',
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname);
    }
})
const upload = multer({storage: storage}).single('testImage');

module.exports = {
    getAllUsers: async (req, res, next) => {
        try {
            const users = await userService.getAllUsers()
            res.json(users)
        } catch (e) {
            next(e)
        }
    },

    getUserById: async (req, res, next) => {
        try {
            const {user_id} = req.params;
            const user = await userService.getUserById(user_id);
            res.json(user)
        } catch (e) {
            next(e)
        }
    },

    createUserImg: (req, res) => {
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
    },

    updateUser: async (req, res, next) => {
        try {
            const {_id} = req.tokenInfo.user; //objectID
            const {user_id} = req.params; //string

            if (user_id !== _id.toString()) {
                return next(new ApiError('Access token doesnt belong to the user you are trying to update'))
            }

            const user = await userService.updateUser(user_id, req.body);
            res.json(user)
        } catch (e) {
            next(e)
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const {user_id} = req.params;
            const {_id, email, name} = req.tokenInfo.user;

            if (user_id !== _id.toString()) {
                return next(new ApiError('The access token doesnt belong to the user you are trying to delete', 400));
            }

            await sendEmail(email, DELETE_USER, {userName: name});

            const user = await userService.deleteUser(user_id);
            res.json(user)
        } catch (e) {
            next(e)
        }
    },
}