// routes/user.js
const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../config');

router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        await User.create({
            username,
            password: hashedPassword,
            purchasedCourses: []
        });


        res.status(201).json({message : "user created"});
    } catch (error) {
        console.error('User Signup Error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { username, type: 'user' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('User Signin Error:', error);
        res.status(500).json({ message: 'Error signing in' });
    }
});

router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find({});
        res.json(courses);
    } catch (error) {
        console.error('Fetch Courses Error:', error);
        res.status(500).json({ message: 'Error fetching courses' });
    }
});
router.post('/courses/:id', userMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { username } = req.body;

        console.log("Username:", username);  // Log to ensure username is available

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            console.error("User not found");
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if course exists
        const course = await Course.findById(id);
        if (!course) {
            console.error("Course not found");
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if course is already purchased
        if (user.purchasedCourses.includes(id)) {
            console.warn("Course already purchased");
            return res.status(400).json({ message: 'Course already purchased' });
        }

        // Add course to user's purchased courses
        user.purchasedCourses.push(id);
        await user.save();

        res.json({ message: 'Course purchased successfully' });
    } catch (error) {
        console.error('Course Purchase Error:', error);
        res.status(500).json({ message: 'Error purchasing course' });
    }
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    try {
        const { username } = req.body;

        // Find user and populate purchased courses
        const user = await User.findOne({ username }).populate('purchasedCourses');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.purchasedCourses);
    } catch (error) {
        console.error('Fetch Purchased Courses Error:', error);
        res.status(500).json({ message: 'Error fetching purchased courses' });
    }
});

router.put('/profile', userMiddleware, async (req, res) => {
    try {
        const { username } = req.body;
        const { newUsername, currentPassword, newPassword } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If updating password, verify current password
        if (newPassword) {
            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Current password is incorrect' });
            }
            // Hash new password
            user.password = await bcrypt.hash(newPassword, 10);
        }

        // If updating username, check if new username is available
        if (newUsername && newUsername !== username) {
            const existingUser = await User.findOne({ username: newUsername });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already taken' });
            }
            user.username = newUsername;
        }

        // Save updates
        await user.save();

        res.json({ 
            message: 'Profile updated successfully',
            username: user.username
        });
    } catch (error) {
        console.error('Profile Update Error:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
});

// Delete user account
router.delete('/profile', userMiddleware, async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password before deletion
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Delete user
        await User.findByIdAndDelete(user._id);

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Account Deletion Error:', error);
        res.status(500).json({ message: 'Error deleting account' });
    }
});

module.exports = router;