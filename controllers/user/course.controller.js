const Course = require('../../models/course.model');
const User = require('../../models/user.model');

const getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({});
        res.json(courses);
    } catch (error) {
        next(error);
    }
};

const purchaseCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const username = req.user.username;

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const user = await User.findOne({ username });
        if (user.purchasedCourses.includes(id)) {
            return res.status(400).json({ message: 'Course already purchased' });
        }

        user.purchasedCourses.push(id);
        await user.save();

        res.json({ message: 'Course purchased successfully' });
    } catch (error) {
        next(error);
    }
};

const getPurchasedCourses = async (req, res, next) => {
    try {
        const username = req.user.username;
        const user = await User.findOne({ username }).populate('purchasedCourses');
        
        res.json(user.purchasedCourses);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCourses,
    purchaseCourse,
    getPurchasedCourses
};