const {
    WELCOME, FORGOT_PASSWORD, DELETE_USER, CREATE_USER, COMPANY_CREATE, ORDER_CREATION, ORDER_CANCEL,
    ORDER_TODAY
} = require("../constants/email.action.enum");

module.exports = {
    [WELCOME]: {
        subject: 'WELCOME SUBJECT',
        templateName: 'welcome'
    },

    [FORGOT_PASSWORD]: {
        subject: 'FORGOT PASS SUBJECT',
        templateName: 'forgot-password'
    },

    [CREATE_USER]: {
        subject: 'CREATE USER SUBJECT',
        templateName: 'create-user'
    },

    [DELETE_USER]: {
        subject: 'DELETE USER SUBJECT',
        templateName: 'delete-user'
    },

    [COMPANY_CREATE]: {
        subject: 'CREATE COMPANY SUBJECT',
        templateName: 'create-company'
    },

    [ORDER_CREATION]: {
        subject: 'ORDER CREATION SUBJECT',
        templateName: 'create-order'
    },

    [ORDER_CANCEL]: {
        subject: 'ORDER CANCEL SUBJECT',
        templateName: 'cancel-order'
    },

    [ORDER_TODAY]: {
        subject: 'ORDER TODAY SUBJECT',
        templateName: 'order-today'
    },
}