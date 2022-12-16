const {Schema, model} = require('mongoose');

const previousPasswordSchema = new Schema({
    access_token: {type: String, required: true},
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
})

module.exports = model('previous_password', previousPasswordSchema);