const {WELCOME, ORDER_ARRIVED, FORGOT_PASSWORD} = require("../constants/email.action.enum");
module.exports = {
    [WELCOME]:{
        subject: 'WELCOME SUBJECT',
        templateName: 'welcome'
    },

    [ORDER_ARRIVED]:{
        subject: 'order arrived SUBJECT',
        templateName: 'order-arrived'
    },

    [FORGOT_PASSWORD]:{
        subject: 'FORGOT PASS SUBJECT',
        templateName: 'forgot-password'
    },
}
