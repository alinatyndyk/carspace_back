const {userService, tokenService} = require("../services");
const {ApiError} = require("../errors");
const {DELETE_USER, CREATE_USER} = require("../constants/email.action.enum");
const {sendEmail} = require("../services/email.service");
const {User} = require("../dataBase");
const multer = require('multer');
const decodeJWT = require('jwt-decode');
const {userValidators} = require("../validators");
const {VERIFICATION_STRING} = require("../constants/token.type.enum");
const {ADMIN_SECRET_KEY} = require("../configs/configs");

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

    createUserImg: async (req, res, next) => {
        upload(req, res, async (err) => {

            const str = req.get(VERIFICATION_STRING);
            const {email, contact_number, name} = req.body;

            try {
                if (req.body.status === 'admin') {
                    if (str !== ADMIN_SECRET_KEY) {
                        tokenService.checkToken(str, VERIFICATION_STRING);

                        const cut = str.substr(str.indexOf(" ") + 1);
                        const decoded = decodeJWT(cut);

                        if(email !== decoded.email){
                            throw new ApiError('The code does not belong to this address', 400)
                        }
                    }
                }
            } catch (e) {
                next(e);
            }

            const validate = userValidators.newUserValidator.validate(req.body);

            if (validate.error) {
                return next(new ApiError(validate.error.message, 400))
            }



            const numberMatch = await userService.getOneByParams({contact_number});
            if (numberMatch) {
                return next(new ApiError('Number has to be unique', 400))
            }

            const emailMatch = await userService.getOneByParams({email});
            if (emailMatch) {
                return next(new ApiError('Email has to be unique', 400))
            }

            const hashPassword = await tokenService.hashPassword(req.body.password);

            await sendEmail(email, CREATE_USER, {userName: name});

            if (!req.file) {
                return next(new ApiError('Upload at least one picture', 400));

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