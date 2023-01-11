const {Schema, model} = require('mongoose');

const carSchema = new Schema({
    brand: {type: String, trim: true, required: true},
    brand_db: {type: String, trim: true, lowercase: true},
    model: {type: String, required: true},
    model_year: {type: Number, required: true},
    description: {type: String, trim: true, default: 'No description', required: true},
    image: {
        data: String,
        link: String
    },
    location: {type: String, trim: true, lowercase: true, required: true},
    min_drivers_age: {type: Number, trim: true, required: true},
    min_rent_time: {type: Number, trim: true, required: true},
    driver_included: {type: Boolean, default: false},
    transmission: {type: String, trim: true, lowercase: true, required: true},
    engine_capacity: {type: String, trim: true, lowercase: true, required: true},
    vehicle_type: {type: String, trim: true, lowercase: true, required: true},
    no_of_seats: {type: Number, required: true},
    fits_bags: {type: Number, req: true},
    price_day_basis: {type: Number, trim: true, required: true},
    // price_month_basis: {type: Number, required: true},
    // price_week_basis: {type: Number, required: true},
    security_deposit: {type: Number, required: true},
    add_milage_charge: {type: Number, required: true},
    //--------------------------------
    // car_features: {
        digital_hud: {type: Boolean, default: false},
        cruise_control: {type: Boolean, default: false},
        adaptive_cruise_control: {type: Boolean, default: false},
        parking_assist: {type: Boolean, default: false},
        parking_sensors: {type: Boolean, default: false},
        reverse_camera: {type: Boolean, default: false},
        three_d_surround_camera: {type: Boolean, default: false},
        tinted_windows: {type: Boolean, default: false},
        power_seats: {type: Boolean, default: false},
        leather_seats: {type: Boolean, default: false},
        massaging_seats: {type: Boolean, default: false},
        rear_ac: {type: Boolean, default: false},
        sunroof_moonroof: {type: Boolean, default: false},
        premium_audio: {type: Boolean, default: false},
        apple_carplay: {type: Boolean, default: false},
        android_auto: {type: Boolean, default: false},
        front_rear_airbags: {type: Boolean, default: false},
        bluetooth: {type: Boolean, default: false},
        usb: {type: Boolean, default: false},
        chiller_freezer: {type: Boolean, default: false},
    // },
    // status: {type: String}, todo if recieved ask sergey
    company: {
        type: Schema.Types.ObjectId,
        ref: 'company'
    },
}, {
    timestamps: true
})

module.exports = model('car', carSchema)