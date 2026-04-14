const router = require('express').Router();
const { ingestLiveMessage } = require('../controllers/eventController');

router.post('/douyin/live-message', ingestLiveMessage);

module.exports = router;
