const express = require('express');
const router = express.Router();
const { getTrainers, getTrainer, createTrainer, updateTrainer, deleteTrainer } = require('../controllers/trainerController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getTrainers);
router.get('/:id', getTrainer);
router.post('/', protect, authorize('admin'), createTrainer);
router.put('/:id', protect, authorize('admin'), updateTrainer);
router.delete('/:id', protect, authorize('admin'), deleteTrainer);

module.exports = router;
