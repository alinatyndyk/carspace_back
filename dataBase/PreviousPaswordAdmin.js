const {Schema, model} = require('mongoose');

const previousPasswordAdminSchema = new Schema({
    password: {type: String, required: true},
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'admin'
    }
}, {
    timestamps: true
})

module.exports = model('previous_password_admin', previousPasswordAdminSchema);