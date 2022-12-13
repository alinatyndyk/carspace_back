const {Schema, model} = require('mongoose');

const carTokenSchema = new Schema({
    car_token: {type: String, trim: true, required: true},
    // refresh_token: {type: String, trim: true, required: true},
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    //date time_period
    date: {type: Date, required: true},
    time_period: {type: String, required: true},
    car: {
        type: Schema.Types.ObjectId,
        ref: 'car'
    }
}, {
    timestamps: true
})

module.exports = model('order_car', carTokenSchema);