const {Schema, model} = require('mongoose');

const adminSchema = new Schema({
    name: {type: String, trim: true, required: true},
    last_name: {type: String, trim: true, required: true},
    contact_number: {type: String, required: true},
    password: {type: String, required: true}
})

module.exports = model('Admin', adminSchema);