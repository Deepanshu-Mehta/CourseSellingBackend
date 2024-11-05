const jwt = require('jsonwebtoken');

// Middleware for handling auth
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    const token = headers.authentication;
    const jwtToken = token.split(" ")[1];
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECERET);
    if(decoded.username && decoded.type === 'admin'){
        next();
    }
    return res.status(401).json({message: "Unauthorized"});

}

module.exports = adminMiddleware;