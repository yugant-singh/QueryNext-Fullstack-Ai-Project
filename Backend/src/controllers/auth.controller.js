import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../services/email.api.js';
import { redis } from '../config/cache.js'


/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
export async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    console.log(email)

    const isUserExist = await userModel.findOne({
      $or: [{ username }, { email }]
    })
    if (isUserExist) {
      return res.status(400).json({
        message: 'User already exists',
        success: false,
        err: "Username or email already in use"
      });
    }

    const user = await userModel.create({ username, email, password })

    const token = jwt.sign({
      email: user.email
    }, process.env.JWT_SECRET)

    // ✅ Email fail hone pe user delete kar do — warna stuck ho jaata hai
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to the QueryNext!',
        text: 'Thank you for registering with us!',
        html: `<p>Hi ${username},</p>
               <p>Thank you for registering with us! We're excited to have you on board.</p>
               <p>Please verify your email address by clicking the link below:</p>
               <a href="${process.env.BASE_URL}/api/auth/verify-email?token=${token}">Verify Email</a>
               <p>Best regards,<br/>The QueryNext Team</p>`
      })
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr.message)
      // Email nahi gayi toh user ko delete karo
      await userModel.findByIdAndDelete(user._id)
      return res.status(500).json({
        message: 'Registration failed — could not send verification email. Please try again.',
        success: false,
        err: emailErr.message
      })
    }

    return res.status(201).json({
      message: 'User registered successfully. Please check your email to verify your account.',
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })

  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      success: false,
      err: err.message
    })
  }
}

/**
  * @route POST /api/auth/login
  * @desc Login a user
  * @access Public
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email }).select('+password')
    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials',
        success: false
      })
    }

    const isPasswordValid = await user.matchPassword(password)
    if (!isPasswordValid) {
      return res.status(400).json({
        message: 'Invalid credentials',
        success: false,
        err: 'Incorrect password'
      })
    }
    if (!user.verified) {
      return res.status(400).json({
        message: 'Please verify your email before logging in',
        success: false,
        err: 'Email not verified'
      })
    }

    const token = jwt.sign({
      email: user.email,
      id: user._id
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie('token', token, {
      httpOnly: true,        // ✅ XSS protection
      maxAge: 7 * 24 * 60 * 60 * 1000  // ✅ 7 days
    })

    return res.status(200).json({
      message: 'Login successful',
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      success: false,
      err: err.message
    })
  }
}

/**
 * @route GET /api/auth/get-me
 * @desc Get current logged in user
 * @access Private
 */
export async function getMe(req, res) {
  try {
    const { email } = req.user
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
        err: 'No user found with this id'
      })
    }

    return res.status(200).json({
      message: 'User fetched successfully',
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      success: false,
      err: err.message
    })
  }
}


/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email
 * @access Public
 */
export async function verifyEmail(req, res) {
  const { token } = req.query
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findOne({ email: decoded.email })
    if (!user) {
      return res.status(400).json({
        message: 'Invalid token',
        success: false,
        err: 'User not found'
      })
    }

    user.verified = true
    await user.save()

    const html = `<p>Hi ${user.username},</p>
                  <p>Your email has been successfully verified! You can now log in to your account.</p>
                  <p>Best regards,<br/>The QueryNest Team</p>`
    return res.send(html)

  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      success: false,
      err: err.message
    })
  }
}

/**
 * @route GET /api/auth/logout
 * @desc Logout a user
 * @access Private
 */
export async function logout(req, res) {
  try {
    const token = req.cookies.token
    res.clearCookie('token')
    await redis.set(token, Date.now().toString())
    return res.status(200).json({
      message: 'Logout successfully',
      success: true
    })
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      success: false,
      err: err.message
    })
  }
}