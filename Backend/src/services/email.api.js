import axios from 'axios'

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { name: 'QueryNest', email: process.env.GOOGLE_USER },
        to: [{ email: to }],
        subject,
        htmlContent: html
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    )
    console.log('Email sent successfully:', response.data.messageId)
  } catch (err) {
    console.error('Email sending failed:', err.response?.data || err.message)
    throw err
  }
}