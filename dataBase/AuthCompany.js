const {Schema, model} = require('mongoose');

const authCompanySchema = new Schema({
    access_token: {type: String, trim: true, required: true},
    refresh_token: {type: String, trim: true, required: true},
    company: {
        type: Schema.Types.ObjectId,
        ref: 'company',
    }
}, {
    timestamps: true
})

module.exports = model('authCompany', authCompanySchema);