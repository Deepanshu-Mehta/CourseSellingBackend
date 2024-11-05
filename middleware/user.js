const jwt = require('jsonwebtoken');
function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const token = headers.authentication;
    const jwtToken = token.split(" ")[1];
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECERET);
    if(decoded.username && decoded.type === 'user'){
        next();
    }
    return res.status(401).json({message: "Unauthorized"});
}

module.exports = userMiddleware;