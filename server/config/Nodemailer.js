import nodemailer from 'nodemailer'

const tranporter = nodemailer.createTransport({
    host:"smtp-relay.brevo.com",
    port:587,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS,
    }
})

export const sendEmail = async({to,subject,html})=>{
    const response = await tranporter.sendMail({
        from:process.env.SENDER_EMAIL,
        to,
        subject,
        html
    })
    return response
}
