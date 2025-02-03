const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    enrollmentDate: { type: Date, default: Date.now },
    classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
}, { timestamps: true });

module.exports = mongoose.models.Student || mongoose.model('Student', studentSchema);
