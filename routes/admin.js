// routes/admin.js
const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course, User } = require("../db");
const router = Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../config');

router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        await Admin.create({
            username,
            password: hashedPassword
        });

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error('Admin Signup Error:', error);
        res.status(500).json({ message: 'Error creating admin' });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find admin
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { username, type: 'admin' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Admin Signin Error:', error);
        res.status(500).json({ message: 'Error signing in' });
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
    try {
        const { courseName, courseDescription, coursePrice, courseImagelink } = req.body;
        
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            coursePrice,
            courseImagelink
        });

        res.status(201).json({
            message: 'Course created successfully',
            courseId: newCourse._id
        });
    } catch (error) {
        console.error('Course Creation Error:', error);
        res.status(500).json({ message: 'Error creating course' });
    }
});

router.get('/courses', adminMiddleware, async (req, res) => {
    try {
        const allCourses = await Course.find({});
        res.json(allCourses);
    } catch (error) {
        console.error('Fetch Courses Error:', error);
        res.status(500).json({ message: 'Error fetching courses' });
    }
});

router.put('/courses/:courseId', adminMiddleware, async (req, res) => {
    try {
        const { courseId } = req.params;
        const { courseName, courseDescription, coursePrice, courseImagelink } = req.body;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Update course
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                courseName,
                courseDescription,
                coursePrice,
                courseImagelink
            },
            { new: true } // Return updated document
        );

        res.json({
            message: 'Course updated successfully',
            course: updatedCourse
        });
    } catch (error) {
        console.error('Course Update Error:', error);
        res.status(500).json({ message: 'Error updating course' });
    }
});

// Delete course
router.delete('/courses/:courseId', adminMiddleware, async (req, res) => {
    try {
        const { courseId } = req.params;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Remove course from all users who purchased it
        await User.updateMany(
            { purchasedCourses: courseId },
            { $pull: { purchasedCourses: courseId } }
        );

        // Delete the course
        await Course.findByIdAndDelete(courseId);

        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Course Deletion Error:', error);
        res.status(500).json({ message: 'Error deleting course' });
    }
});

module.exports = router;