const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name: {type: String, required: true},
    last_name: {type: String, trim: true, required: true},
    age: {type: Number, required: true},
    status: {type: String, default: 'regular'},
    contact_number: {type: String, required: true, unique: true},
    email: {type: String, trim: true, lowercase: true, required: true, unique: true},
    password: {type: String, required: true},
    image: {
        data: String,
        link: String
    }
})

module.exports = model('user', userSchema);