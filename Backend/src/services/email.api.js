import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GMAIL_APP_PASSWORD  
  }
})

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `QueryNest <${process.env.GOOGLE_USER}>`,
      to,
      subject,
      html
    })
    console.log("Email sent:", info.response)
  } catch (err) {
    console.error("Email sending failed:", err.message)
    throw err
  }
}