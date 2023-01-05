const {Schema, model} = require('mongoose');

const carTokenSchema = new Schema({
    car_token: {type: String, trim: true, required: true},
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'company'
    },
    from_date: {type: Date, required: true},
    to_date: {type: Date, required: true},
    // card: {type: Number, required: true},
    // card_expiry_date: {type: String, required: true},
    // cars_cvv: {type: Number, required: true},
    Difference_In_Days: {type: String},
    car: {
        type: Schema.Types.ObjectId,
        ref: 'car'
    }
}, {
    timestamps: true
})

module.exports = model('order_car', carTokenSchema);