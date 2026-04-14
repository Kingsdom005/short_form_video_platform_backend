const router = require('express').Router();
const { getOverviewMetrics, getRecentMessages } = require('../controllers/metricController');

router.get('/overview', getOverviewMetrics);
router.get('/messages/recent', getRecentMessages);

module.exports = router;
