const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    courseDescription: { type: String, required: true },
    coursePrice: { type: Number, required: true },
    courseImagelink: { type: String, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', CourseSchema);