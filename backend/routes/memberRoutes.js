const express = require('express');
const router = express.Router();
const { getMembers, getMember, updateMember, getMyProfile, updateMyProfile } = require('../controllers/memberController');
const { protect, authorize } = require('../middleware/auth');

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);
router.get('/', protect, authorize('admin'), getMembers);
router.get('/:id', protect, authorize('admin'), getMember);
router.put('/:id', protect, authorize('admin'), updateMember);

module.exports = router;
