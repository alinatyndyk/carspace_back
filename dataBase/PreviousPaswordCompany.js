const {Schema, model} = require('mongoose');

const previousPasswordUserSchema = new Schema({
    password: {type: String, required: true},
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
})

module.exports = model('previous_password_user', previousPasswordUserSchema);