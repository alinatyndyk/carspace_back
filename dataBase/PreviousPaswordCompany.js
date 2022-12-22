const {Schema, model} = require('mongoose');

const previousPasswordCompanySchema = new Schema({
    password: {type: String, required: true},
    company: {
        type: Schema.Types.ObjectId,
        ref: 'company'
    }
}, {
    timestamps: true
})

module.exports = model('previous_password_company', previousPasswordCompanySchema);