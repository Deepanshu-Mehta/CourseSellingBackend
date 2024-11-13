const express = require('express');
const router = express.Router();
const adminAuth = require('../../middleware/auth/adminAuth');
const authController = require('../../controllers/admin/auth.controller');
const courseController = require('../../controllers/admin/course.controller');

// Auth routes
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

// Course routes (protected)
router.post('/courses', adminAuth, courseController.createCourse);
router.get('/courses', adminAuth, courseController.getAllCourses);
router.put('/courses/:courseId', adminAuth, courseController.updateCourse);
router.delete('/courses/:courseId', adminAuth, courseController.deleteCourse);

module.exports = router;