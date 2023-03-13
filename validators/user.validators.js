const Joi = require('joi');

const {PASSWORD, EMAIL, NUMBER} = require("../constants/regex.enum");
const {ApiError} = require("../errors");

const nameValidator = Joi.string().alphanum().min(2).max(35).trim().error(new ApiError('Name is required', 400));
const lastnameValidator = Joi.string().alphanum().min(2).max(35).trim();
const ageValidator = Joi.number().integer().min(18).max(120);
const emailValidator = Joi.string().regex(EMAIL).lowercase().trim().error(new ApiError('Email not valid', 400));
const passValidator = Joi.string().regex(PASSWORD).error(new ApiError('Password not valid (Accepts the letters and numbers with minimum 8 lengths)'));
const numberValidator = Joi.string().regex(NUMBER).error(new ApiError('The phone number is not valid. Valid formats: (123) 456-7890,  (123)456-7890,  123-456-7890,  1234567890,  +31636363634', 400))
const imageValidator = Joi.any()

const newUserValidator = Joi.object({
    name: nameValidator.required(),
    last_name: lastnameValidator.required(),
    contact_number: numberValidator.required(),
    age: ageValidator,
    email: emailValidator.required(),
    status: Joi.string().valid('regular', 'admin').required(),
    password: passValidator.required(),
    testImage: imageValidator
})

const updateUserValidator = Joi.object({
    name: nameValidator,
    last_name: nameValidator,
    age: ageValidator,
    email: emailValidator,
    contact_number: numberValidator

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