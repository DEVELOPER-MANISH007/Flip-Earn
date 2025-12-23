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
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SENDER_EMAIL) {
            console.error('❌ Email configuration missing:', {
                hasSMTP_USER: !!process.env.SMTP_USER,
                hasSMTP_PASS: !!process.env.SMTP_PASS,
                hasSENDER_EMAIL: !!process.env.SENDER_EMAIL
            });
            throw new Error('Email configuration is missing');
        }

        console.log(`📧 Attempting to send email to: ${to}`);
        
        const response = await tranporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to,
            subject,
            html
        });
        
        console.log(`✅ Email sent successfully. MessageId: ${response.messageId}`);
        return response;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw error;
    }
}
