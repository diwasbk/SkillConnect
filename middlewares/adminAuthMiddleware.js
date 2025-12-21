export const adminAuthMiddleware = (req, res, next) => {
    // Check if the logged-in user's role is not "admin"
    if (req.user.role !== "admin") {
        // If not admin, deny access
        return res.status(401).send({
            message: "Access Denied: Authorization Required!",
            success: false
        })
    }
    // If user is admin, proceed to the next phase
    next()
}
