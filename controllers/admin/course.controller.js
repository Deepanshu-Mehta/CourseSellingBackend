const CourseService = require('../../services/course.service');

const createCourse = async (req, res, next) => {
    try {
        const { courseName, courseDescription, coursePrice, courseImagelink } = req.body;
        
        const newCourse = await CourseService.createCourse({
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
        next(error);
    }
};

const getAllCourses = async (req, res, next) => {
    try {
        const courses = await CourseService.getAllCourses();
        res.json(courses);
    } catch (error) {
        next(error);
    }
};

const updateCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const courseData = req.body;
        
        const updatedCourse = await CourseService.updateCourse(courseId, courseData);
        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json({
            message: 'Course updated successfully',
            course: updatedCourse
        });
    } catch (error) {
        next(error);
    }
};

const deleteCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        
        const deletedCourse = await CourseService.deleteCourse(courseId);
        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    updateCourse,
    deleteCourse
};
