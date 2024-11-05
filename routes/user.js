const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User } = require("../db");
const jwt = require('jsonwebtoken');
// User Routes
router.post('/signup', (req, res) => {
    // Implement user signup logic
    const {username, password} = req.body;
    const user = User.findOne({username, password});
    if (user) {
        res.status(400).send({message: 'User already exists'});
    }
    const jwtToken = jwt.sign({username, type :'user'}, process.env.JWT_SECRET);
    res.status(200).json(jwtToken);
});

router.post('/signin', (req, res) => {
    // Implement admin signup logic
    const {username, password} = req.body;
    
});

router.get('/courses', (req, res) => {
    // Implement listing all courses logic
    const allCourses = Course.find({});
    res.status(200).json(allCourses);
});

router.post('/courses/:courseId', userMiddleware, (req, res) => {
    // Implement course purchase logic
});

router.get('/purchasedCourses', userMiddleware, (req, res) => {
    // Implement fetching purchased courses logic
});

module.exports = router