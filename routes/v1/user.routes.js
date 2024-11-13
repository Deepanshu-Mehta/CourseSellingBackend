const express = require('express');
const router = express.Router();
const userAuth = require('../../middleware/auth/userAuth');
const userController = require('../../controllers/user/auth.controller');
const courseController = require('../../controllers/user/course.controller');
const profileController = require('../../controllers/user/profile.controller');

// Auth routes
router.post('/signup', userController.signup);
router.post('/signin', userController.signin);

// Course routes
router.get('/courses', courseController.getAllCourses);
router.post('/courses/:id', userAuth, courseController.purchaseCourse);
router.get('/purchasedCourses', userAuth, courseController.getPurchasedCourses);

// Profile routes
router.put('/profile', userAuth, profileController.updateProfile);
router.delete('/profile', userAuth, profileController.deleteProfile);

module.exports = router;