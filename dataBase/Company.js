const {Schema, model} = require('mongoose');

const companySchema = new Schema({
    name: {type: String, trim: true, required: true},
    contact_number: {type: String, required: true},
    email: {type: String, trim: true, lowercase: true, required: true, unique: true},
    description: {type: String, default: 'No description'},
    password: {type: String, required: true},
    cars: {
        type: [Schema.Types.ObjectId],
        ref: 'car'
    },
    image: {
        data: String,
        link: String
    },
})

module.exports = model('company', companySchema);