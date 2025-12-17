import jwt from "jsonwebtoken"

// Generate Token
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 3000 })
}

// Auth Middleware
const jwtAuthMiddleware = (req, res, next) => {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send({
            message: "Unauthorized: No token provided",
            success: false
        })
    }
    // Verify token
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Attach user info to the request object
    req.user = data;
    // Pass to the next phase
    next();
};

export { generateToken, jwtAuthMiddleware }