const Joi = require('joi');

const {PASSWORD, EMAIL, NUMBER} = require("../constants/regex.enum");
const {ApiError} = require("../errors");

const nameValidator = Joi.string().alphanum().min(2).max(35).trim();
const lastnameValidator = Joi.string().alphanum().min(2).max(35).trim();
const numberValidator = Joi.string().regex(NUMBER).error(new ApiError('Number not valid', 400))

const passValidator = Joi.string().regex(PASSWORD).error(new ApiError('Password not valid'));

const newAdminValidator = Joi.object({
    name: nameValidator.required(),
    last_name: lastnameValidator.required(),
    //todo code validator
    password: passValidator.required(),

})

const updateAdminValidator = Joi.object({
    name: nameValidator,
    last_name: lastnameValidator,
    contact_number: numberValidator,
    password: passValidator,

})

const loginAdminValidator = Joi.object({
    contact_number: numberValidator.required().error(new ApiError('Wrong email or pass', 400)),
    password: passValidator.required().error(new ApiError('Wrong email or pass', 400)),

});


module.exports = {
    newAdminValidator,
    updateAdminValidator,
    loginAdminValidator
}