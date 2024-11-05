const { Admin } = require("../db");

// Middleware for handling auth
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const {username, password} = req.headers;
    const user = Admin.findOne({ username, password });
    if(!user){
        res.status(400).json({'message': "You are not Admin"});
    }
    next();
}

module.exports = adminMiddleware;