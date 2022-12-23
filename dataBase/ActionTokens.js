const {Schema, model} = require('mongoose');

const actionTokensSchema = new Schema({
    token: {type: String, required: true},
    tokenType: {type: String},
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'company'
    }
}, {
    timestamps: true
})

module.exports = model('action_tokens', actionTokensSchema);