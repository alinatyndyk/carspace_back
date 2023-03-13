const Joi = require('joi');
const {ApiError} = require("../errors");

const brandValidator = Joi.string().min(2).max(30).valid().trim(); //todo
const modelValidator = Joi.string().min(2).max(30).trim();
const yearValidator = Joi.number().min(1960).max(new Date().getFullYear());
const descriptionValidator = Joi.string().min(10).trim();
const minAgeValidator = Joi.number().min(18).max(85)
const priceValidator = Joi.number().positive();
const rentValidator = Joi.number().positive();
const locationValidator = Joi.string().valid('London', 'Birmingham', 'Manchester', 'Leeds', 'Sheffield', 'Liverpool', 'Bristol', 'Wakefield');
const imageValidator = Joi.any()
const booleanValidator = Joi.boolean();
const stringValidator = Joi.string();
const numberValidator = Joi.number().positive().error(new ApiError('Number has to be positive', 400));

const newCarValidator = Joi.object({
    brand: brandValidator.required(),
    model: modelValidator.required(),
    model_year: yearValidator.required(),
    description: descriptionValidator,
    location: locationValidator.required(),
    min_drivers_age: minAgeValidator.required(), // --done
    min_rent_time: rentValidator.required(), // --done
    driver_included: booleanValidator,
    transmission: stringValidator.required(),
    engine_capacity: stringValidator.required(),
    vehicle_type: stringValidator.required(),
    no_of_seats: numberValidator.required(),
    fits_bags: numberValidator.required(),
    price_day_basis: priceValidator.required(),
    testImage: imageValidator,
    files: imageValidator,
    security_deposit: rentValidator.required(),
    add_milage_charge: rentValidator.required(),
    car_features: Joi.object({
        digital_hud: booleanValidator,
        cruise_control: booleanValidator,
        adaptive_cruise_control: booleanValidator,
        parking_assist: booleanValidator,
        parking_sensors: booleanValidator,
        reverse_camera: booleanValidator,
        three_d_surround_camera: booleanValidator,
        tinted_windows: booleanValidator,
        power_seats: booleanValidator,
        leather_seats: booleanValidator,
        massaging_seats: booleanValidator,
        rear_ac: booleanValidator,
        sunroof_moonroof: booleanValidator,
        premium_audio: booleanValidator,
        front_rear_airbags: booleanValidator,
        apple_carplay: booleanValidator,
        android_auto: booleanValidator,
        bluetooth: booleanValidator,
        usb: booleanValidator,
        chiller_freezer: booleanValidator
    })
});

const updateCarValidator = Joi.object({
    model: modelValidator,
    model_year: yearValidator,
    price_day_basis: priceValidator,
    description: descriptionValidator
});


module.exports = {
    newCarValidator,
    updateCarValidator
}