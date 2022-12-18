const {Schema, model} = require('mongoose');

const carTokenSchema = new Schema({
    car_token: {type: String, trim: true, required: true},
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    from_date: {type: Date, required: true},
    to_date: {type: Date, required: true},
    Difference_In_Days: {type: String},
    car: {
        type: Schema.Types.ObjectId,
        ref: 'car'
    }
}, {
    timestamps: true
})

module.exports = model('order_car', carTokenSchema);