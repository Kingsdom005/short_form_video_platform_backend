const router = require('express').Router();
const { listLeads } = require('../controllers/leadController');

router.get('/', listLeads);

module.exports = router;
