const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name: {type: String, trim: true, required: true},
    last_name: {type: String, trim: true, required: true},
    age: {type: Number, required: true},
    driving_license_country: {type: String, trim: true, lowercase: true, required: true},
    email: {type: String, trim: true, lowercase: true, required: true, unique: true},
    password: {type: String, required: true}
})

module.exports = model('user', userSchema);