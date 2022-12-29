const Joi = require('joi');

const {PASSWORD, EMAIL, NUMBER} = require("../constants/regex.enum");
const {ApiError} = require("../errors");

const nameValidator = Joi.string().alphanum().min(2).max(35).trim().error(new ApiError('Name is required', 400));
const lastnameValidator = Joi.string().alphanum().min(2).max(35).trim();
const ageValidator = Joi.number().integer().min(18).max(120);
const emailValidator = Joi.string().regex(EMAIL).lowercase().trim().error(new ApiError('Email not valid', 400));
const passValidator = Joi.string().regex(PASSWORD).error(new ApiError('Password not valid'));
const numberValidator = Joi.string().regex(NUMBER).error(new ApiError('Number not valid', 400))
const imageValidator = Joi.any()

const newUserValidator = Joi.object({
    name: nameValidator.required(),
    last_name: lastnameValidator.required(),
    contact_number: numberValidator.required(),
    age: ageValidator,
    email: emailValidator.required(),
    password: passValidator.required(),
    image: imageValidator.required()

})

const updateUserValidator = Joi.object({
    name: nameValidator,
    age: ageValidator,
    email: emailValidator,
    password: passValidator,

})

const loginUserValidator = Joi.object({
    email: emailValidator.required().error(new ApiError('Wrong email or pass', 400)),
    password: passValidator.required().error(new ApiError('Wrong email or pass', 400)),

});

const userPasswordValidator = Joi.object({
    password: passValidator.required().error(new ApiError('Wrong pass validation', 400)),

});

const userEmailValidator = Joi.object({
    email: emailValidator.required().error(new ApiError('Wrong email validation', 400)),
});

module.exports = {
    newUserValidator,
    updateUserValidator,
    loginUserValidator,
    userPasswordValidator,
    userEmailValidator
}