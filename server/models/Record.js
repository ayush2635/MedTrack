const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reportDate: {
        type: String,
        required: true,
    },
    rawCandidates: {
        type: Array,
        required: true,
    },
    interpretation: {
        type: Array,
        required: true,
    },
    summary: {
        patient: String,
        clinician: String,
    },
    modelMeta: {
        modelName: String,
        timestamp: Date,
        promptHash: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Record', RecordSchema);
