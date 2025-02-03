const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    contactInfo: { type: String, required: true },
    capacity: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.models.School || mongoose.model('School', schoolSchema);
