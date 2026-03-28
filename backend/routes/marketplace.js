const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getListings,
  createListing,
  deleteListing,
  updateStatus
} = require('../controllers/marketplaceController');

router.get('/listings', auth, getListings);
router.post('/listings', auth, createListing);
router.delete('/listings/:id', auth, deleteListing);
router.put('/listings/:id/status', auth, updateStatus);

module.exports = router;