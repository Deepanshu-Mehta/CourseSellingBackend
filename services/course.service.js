const Course = require('../models/course.model');
const User = require('../models/user.model');

class CourseService {
    static async createCourse(courseData) {
        return await Course.create(courseData);
    }

    static async getAllCourses() {
        return await Course.find({});
    }

    static async updateCourse(courseId, courseData) {
        return await Course.findByIdAndUpdate(
            courseId,
            courseData,
            { new: true }
        );
    }

    static async deleteCourse(courseId) {
        await User.updateMany(
            { purchasedCourses: courseId },
            { $pull: { purchasedCourses: courseId } }
        );
        return await Course.findByIdAndDelete(courseId);
    }
}

module.exports = CourseService;