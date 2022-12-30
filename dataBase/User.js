const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name: {type: String, required: true},
    last_name: {type: String, trim: true, required: true},
    age: {type: Number, required: true},
    contact_number: {type: String, required: true},
    email: {type: String, trim: true, lowercase: true, required: true, unique: true},
    password: {type: String, required: true},
    image: {
        data: Buffer,
        contentType: String
    },
})

module.exports = model('user', userSchema);