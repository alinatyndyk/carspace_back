const {Schema, model} = require('mongoose');

const authAdminSchema = new Schema({
    access_token: {type: String, trim: true, required: true},
    refresh_token: {type: String, trim: true, required: true},
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'admin',
    }
}, {
    timestamps: true
})

module.exports = model('authAdmin', authAdminSchema);