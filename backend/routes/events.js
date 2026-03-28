const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getEvents,
  createEvent,
  joinEvent,
  leaveEvent
} = require('../controllers/eventsController');

router.get('/', auth, getEvents);
router.post('/', auth, createEvent);
router.post('/:id/join', auth, joinEvent);
router.delete('/:id/leave', auth, leaveEvent);

module.exports = router;