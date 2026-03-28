const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getLocations,
  createLocation,
  rateLocation,
  getLocationRating
} = require('../controllers/mapController');

router.get('/locations', auth, getLocations);
router.post('/locations', auth, createLocation);
router.post('/locations/:id/rate', auth, rateLocation);
router.get('/locations/:id/rating', auth, getLocationRating);

module.exports = router;