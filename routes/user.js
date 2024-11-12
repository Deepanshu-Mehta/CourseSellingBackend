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

        // Generate token
        const token = jwt.sign(
            { username, type: 'user' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ token });
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

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    try {
        const { courseId } = req.params;
        const { username } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if course is already purchased
        if (user.purchasedCourses.includes(courseId)) {
            return res.status(400).json({ message: 'Course already purchased' });
        }

        // Add course to user's purchased courses
        user.purchasedCourses.push(courseId);
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

module.exports = router;