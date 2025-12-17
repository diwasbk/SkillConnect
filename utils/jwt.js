import jwt from "jsonwebtoken"

// Generate Token
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 3000 })
}

export { generateToken }