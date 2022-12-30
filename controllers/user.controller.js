const {userService, tokenService} = require("../services");
const {ApiError} = require("../errors");
const {WELCOME, DELETE_USER, CREATE_USER} = require("../constants/email.action.enum");
const {sendEmail} = require("../services/email.service");
const {User, Image_model} = require("../dataBase");
const multer = require('multer');
const {Error} = require("mongoose");
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

    // createUser: async (req, res, next) => {
    //     try {
    //         const {email, name} = req.body;
    //         const hashPassword = await tokenService.hashPassword(req.body.password)
    //         await sendEmail(email, CREATE_USER, {userName: name});
    //         const createdUser = await userService.createUser({...req.body, password: hashPassword});
    //         res.json(createdUser);
    //     } catch (e) {
    //         next(e);
    //     }
    // },

    createUserImg: (req, res) => {
        // const {email, name, password} = req.body;
        // console.log('crate user', email, name, password);
        // const hashPassword = await tokenService.hashPassword(req.body.password);
        // await sendEmail(email, CREATE_USER, {userName: name});
        // console.log(name);
        upload(req, res, (err) => {
            console.log(req.body, 'in upload');
            console.log(req.file);
            if (err) {
                console.log(err);
            } else {
                console.log('in else', req.body);
                console.log(req.file, 'req.file');
                const newImage = new User({
                    ...req.body,
                    image: {
                        data: req.file,
                        contentType: 'image/png'
                    }
                })
                newImage.save()
                    .then(() => res.send('successfully uploaded'))
                    .catch(err => new Error('Something is wrong'))
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