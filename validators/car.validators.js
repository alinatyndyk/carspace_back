const Joi = require('joi');

const brandValidator = Joi.string().min(2).max(30).trim(); //todo
const modelValidator = Joi.string().min(2).max(30).trim();
const yearValidator = Joi.number();

const newCarValidator = Joi.object({
    brand: brandValidator.required(),
    model: modelValidator.required(),
    model_year: yearValidator.required()
});

const updateCarValidator = Joi.object({
    brand: brandValidator,
    model: modelValidator,
    model_year: yearValidator
});


module.exports = {
    newCarValidator,
    updateCarValidator
}