const {Schema, model} = require('mongoose');

const carSchema = new Schema({
    brand: {type: String, trim: true, required: true},
    model: {type: String, required: true},
    model_year: {type: Number, required: true},
    // vehicle_type: {type: String, trim: true, lowercase: true, required: true},
    // transmission: {type: String, trim: true, lowercase: true, required: true},
    // engine_capacity: {type: String, trim: true, lowercase: true, required: true},
    // price_day_basis: {type: Number, required: true},
    // min_rent_time: {type: String, trim: true},
    // price_week_basis: {type: Number, required: true},
    // price_month_basis: {type: Number, required: true},
    // driver_included: {type: Boolean, required: true},
    // no_of_seats: {type: Number, required: true},
    // location: {type: String, trim: true, lowercase: true, required: true},
    // insurance_included: {type: Boolean, required: true},
    // additional_driver_insurance: {type: Number, required: true},
    // add_milage_charge: {type: Number, required: true},
    // min_drivers_age: {type: Number, required: true},
    // payment_mode: {type: Array.of(String), lowercase: true, required: true},
    // description: {type: String, trim: true, required: true}
    company: {
        type: Schema.Types.ObjectId,
        ref: 'company'
    },
}, {
    timestamps: true
})

module.exports = model('car', carSchema)