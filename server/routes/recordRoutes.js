const express = require('express');
const router = express.Router();
const { saveRecord, getHistory, getAllRecords, getRecordById, deleteRecord } = require('../controllers/recordController');
const { protect } = require('../middleware/authMiddleware');

router.post('/records', protect, saveRecord);
router.get('/history/:testName', protect, getHistory);
router.get('/records', protect, getAllRecords); // Optional: Get all records for dashboard
router.get('/records/:id', protect, getRecordById);
router.delete('/records/:id', protect, deleteRecord);

module.exports = router;
