import SibApiV3Sdk from '@getbrevo/brevo'

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
apiInstance.authentications['apiKey'].apiKey = process.env.BREVO_API_KEY

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

    sendSmtpEmail.subject = subject
    sendSmtpEmail.htmlContent = html
    sendSmtpEmail.sender = {
      name: 'QueryNest',
      email: process.env.GOOGLE_USER
    }
    sendSmtpEmail.to = [{ email: to }]

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log('Email sent successfully:', data?.body?.messageId)
  } catch (err) {
    console.error('Email sending failed:', err.message)
    throw err
  }
}