const {Schema, model} = require('mongoose');

const authUserSchema = new Schema({
    access_token: {type: String, trim: true, required: true},
    refresh_token: {type: String, trim: true, required: true},
    company: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    }
}, {
    timestamps: true
})

module.exports = model('authUser', authUserSchema);