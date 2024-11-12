const jwt = require('jsonwebtoken');
function userMiddleware(req, res, next) {
    // Implement user auth logic
    try {
        // Access token from Authorization header
        const authHeader = req.headers?.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header missing" });
        }

        // Extract token from "Bearer <token>"
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        // Verify token using the correct secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check decoded payload
        if (decoded.username && decoded.type === 'user') {
            return next();
        } else {
            return res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = userMiddleware;