const Joi = require('joi');

const {NUMBER, PASSWORD, EMAIL} = require("../constants/regex.enum");
const {ApiError} = require("../errors");

const nameValidator = Joi.string().alphanum().min(2).max(30).trim();
const numberValidator = Joi.string().regex(NUMBER).error(new ApiError('Number not valid', 400))
const passValidator = Joi.string().regex(PASSWORD).error(new ApiError('Password not valid'));
const emailValidator = Joi.string().regex(EMAIL).lowercase().trim().error(new ApiError('Email not valid', 400));
const descriptionValidator = Joi.string().min(10).trim();
const imageValidator = Joi.any();

const newCompanyValidator = Joi.object({
    name: nameValidator.required(),
    contact_number: numberValidator.required(),
    password: passValidator.required(),
    email: emailValidator.required(),
    description: descriptionValidator,
    testImage: imageValidator
});

const updateCompanyValidator = Joi.object({
    name: nameValidator,
    contact_number: numberValidator,
    email: emailValidator,
    description: descriptionValidator
});

const loginCompanyValidator = Joi.object({
    contact_number: numberValidator.required(),
    password: passValidator.required()
});

module.exports = {
    newCompanyValidator,
    updateCompanyValidator,
    loginCompanyValidator,
    numberValidator
}