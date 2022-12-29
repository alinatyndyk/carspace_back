const {Schema, model} = require('mongoose');

const brandSchema = new Schema({
    brand: {type: String, trim: true, required: true},
    brand_db: {type: String, trim: true, lowercase: true},
    // todo http
    cars: {
        type: [Schema.Types.ObjectId],
        ref: 'car'
    }
})

module.exports = model('brand', brandSchema);