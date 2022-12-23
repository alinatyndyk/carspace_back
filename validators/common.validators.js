const Joi = require('joi');

const {PASSWORD, EMAIL, NUMBER} = require("../constants/regex.enum");
const {ApiError} = require("../errors");

const passValidator = Joi.string().regex(PASSWORD)
const emailValidator = Joi.string().regex(EMAIL).lowercase().trim()
const numberValidator = Joi.string().regex(NUMBER)


const PasswordValidator = Joi.object({
    password: passValidator.required().error(new ApiError('The password is not valid', 400)),

});

const EmailValidator = Joi.object({
    email: emailValidator.required().error(new ApiError('The email is not valid', 400)),
});

const NumberValidator = Joi.object({
    contact_number: numberValidator.required().error(new ApiError('The number is not valid', 400)),
});


module.exports = {
    PasswordValidator,
    EmailValidator,
    NumberValidator
}