const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload'); // 1. Додај го uploader-от горе
const {
  getListings,
  createListing,
  searchListings,
  deleteListing,
  updateStatus
} = require('../controllers/marketplaceController');

// Важно: Рутата за search мора да биде пред рутите со параметар (:id) за да не ја меша Express
router.get('/listings/search', auth, searchListings);

router.get('/listings', auth, getListings);

// 2. Додај го upload.single('image') во POST рутата за креирање
router.post('/listings', auth, upload.single('image'), createListing);

router.delete('/listings/:id', auth, deleteListing);
router.put('/listings/:id/status', auth, updateStatus);

module.exports = router;