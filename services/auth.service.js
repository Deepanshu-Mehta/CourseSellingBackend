const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');
const Admin = require('../models/admin.model');
const User = require('../models/user.model');

class AuthService {
    static async hashPassword(password) {
        if (!password) {
            throw new Error('Password is required');
        }
        
        if (typeof password !== 'string') {
            throw new Error('Password must be a string');
        }
        
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        
        return await bcrypt.hash(password, 10);
    }

    static async comparePassword(password, hashedPassword) {
        if (!password || !hashedPassword) {
            throw new Error('Password and hashed password are required');
        }
        return await bcrypt.compare(password, hashedPassword);
    }

    static generateToken(username, type) {
        if (!username || !type) {
            throw new Error('Username and type are required for token generation');
        }
        
        if (!['admin', 'user'].includes(type)) {
            throw new Error('Invalid user type');
        }

        return jwt.sign(
            { username, type },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    static async createAdmin(username, password) {
        if (!username) {
            throw new Error('Username is required');
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            throw new Error('Admin already exists');
        }

        const hashedPassword = await this.hashPassword(password);
        return await Admin.create({ 
            username, 
            password: hashedPassword 
        });
    }

    static async createUser(username, password) {
        if (!username) {
            throw new Error('Username is required');
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await this.hashPassword(password);
        return await User.create({ 
            username, 
            password: hashedPassword,
            purchasedCourses: []
        });
    }
}

module.exports = AuthService;