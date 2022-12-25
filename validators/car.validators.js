const Joi = require('joi');
const {valid} = require("joi");
const {regexBrand} = require("../constants/car.valid");

const brandValidator = Joi.string().min(2).max(30).valid().trim(); //todo
const modelValidator = Joi.string().min(2).max(30).trim();
const yearValidator = Joi.number();
const minAgeValidator = Joi.number().min(18).max(85)
const priceValidator = Joi.number();
const rentValidator = Joi.number();

const newCarValidator = Joi.object({
    brand: brandValidator.required(),
    model: modelValidator.required(),
    model_year: yearValidator.required(),
    min_drivers_age: minAgeValidator.required(), // --done
    min_rent_time: rentValidator.required(), // --done
    price_day_basis: priceValidator.required(),
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