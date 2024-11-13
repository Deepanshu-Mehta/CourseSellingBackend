const AuthService = require('../../services/auth.service');
const User = require('../../models/user.model');

const signup = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        await AuthService.createUser(username, password);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        next(error);
    }
};

const signin = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValidPassword = await AuthService.comparePassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = AuthService.generateToken(username, 'user');
        res.json({ token });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signup,
    signin
};