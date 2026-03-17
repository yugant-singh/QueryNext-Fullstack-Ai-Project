import jwt from 'jsonwebtoken'
import { redis } from '../config/cache.js'
export const authMiddleware = async (req, res, next) => {
try{
    const token  = req.cookies.token
    if(!token){
        return res.status(401).json({
            message: 'Unauthorized',
            success: false,
            err: 'No token provided'
        })
    }

    const isBlacklisted = await redis.get(token)
    if(isBlacklisted){
        return res.status(401).json({
            message: 'Unauthorized',
            success: false,
            err: 'Token is blacklisted'
        })
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded)
    req.user = decoded
    console.log(req.user)
    next()

        }
        catch(err){
            return res.status(401).json({
                message: 'Unauthorized',
                success: false,
                err: 'Invalid token'
            })
        }
}

