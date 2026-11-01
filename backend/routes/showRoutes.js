const express = require('express');
const router = express.Router();
const {
  getShows,
  getShowById,
  getShowSeats,
  createShow,
  deleteShow,
} = require('../controllers/showController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getShows)
  .post(protect, admin, createShow);

router.route('/:id')
  .get(getShowById)
  .delete(protect, admin, deleteShow);

router.get('/:id/seats', getShowSeats);

module.exports = router;
