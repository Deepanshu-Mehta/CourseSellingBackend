const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/jwt');

const adminAuth = (req, res, next) => {
    try {
        const authHeader = req.headers?.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header missing" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.username && decoded.type === 'admin') {
            req.user = decoded;
            return next();
        }
        return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = adminAuth;