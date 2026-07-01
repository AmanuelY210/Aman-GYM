const express = require('express');
const router = express.Router();
const { getPlans, getAllPlans, getPlan, createPlan, updatePlan, deletePlan } = require('../controllers/planController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getPlans);
router.get('/all', protect, authorize('admin'), getAllPlans);
router.get('/:id', getPlan);
router.post('/', protect, authorize('admin'), createPlan);
router.put('/:id', protect, authorize('admin'), updatePlan);
router.delete('/:id', protect, authorize('admin'), deletePlan);

module.exports = router;
