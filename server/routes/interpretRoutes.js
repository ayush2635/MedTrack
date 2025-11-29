const express = require('express');
const router = express.Router();
const multer = require('multer');
const { interpret } = require('../controllers/interpretController');

const { protect } = require('../middleware/authMiddleware');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/interpret', protect, upload.single('file'), interpret);

module.exports = router;
