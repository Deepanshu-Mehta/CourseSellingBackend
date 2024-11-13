const AuthService = require('../../services/auth.service');
const Admin = require('../../models/admin.model');

const signup = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        await AuthService.createAdmin(username, password);
        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        next(error);
    }
};

const signin = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValidPassword = await AuthService.comparePassword(password, admin.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = AuthService.generateToken(username, 'admin');
        res.json({ token });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signup,
    signin
};