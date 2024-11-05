const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();

// Admin Routes
router.post('/signup', async(req, res) => {
    // Implement admin signup logic
    const {username, password} = req.body;
    const admin = await Admin.findOne({username, password});
    if(admin){
        res.status(400).send({message: "Admin already exists"});
    }
    await Admin.create({
        username, password
    });
    res.status(201).send({message: "Admin created successfully"});
});

router.post('/courses', adminMiddleware, async(req, res) => {
    // Implement course creation logic
    const {courseName, courseDescription, coursePrice, courseImagelink} = req.body;
    const newCourse = await Course.create({courseName, courseDescription, coursePrice, courseImagelink});
    res.status(200).json({ message: 'Course created successfully', courseId: newCourse._id});
});

router.get('/courses', adminMiddleware, (req, res) => {
    // Implement fetching all courses logic
    const allCourses = Course.find({});
    res.status(200).json(allCourses);
});

module.exports = router;