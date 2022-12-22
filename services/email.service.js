const nodeMailer = require('nodemailer');
const path = require('path');

const {NO_REPLY_EMAIL, NO_REPLY_PASSWORD, FRONTEND_URL} = require("../configs/configs");
const emailTemplatesObj = require('../email-templates');
const EmailTemplates = require('email-templates');
const {ApiError} = require("../errors");

const sendEmail = async (userMail, emailAction, locals = {}) => {
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: NO_REPLY_EMAIL, //todo add email
            pass: NO_REPLY_PASSWORD
        }
    })

    const templateParser = new EmailTemplates({
        views: {
            root: path.join(process.cwd(), 'email-templates')
        }
    });


    const emailInfo = emailTemplatesObj[emailAction];
    const html = await templateParser.render(emailInfo.templateName, {...locals, frontendUrl: FRONTEND_URL})


    if (!emailInfo){
        throw new ApiError('wrong template name', 500)
    }

    return transporter.sendMail({
        from: 'No reply node js copy',
        to: userMail,
        subject: emailInfo.subject,
        html: html
    })
}

module.exports = {
    sendEmail
}