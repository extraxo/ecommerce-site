const express = require('express');
const router = express.Router();
const catalogueController = require('../controllers/catalogueController');

router.get('/kits', catalogueController.getKits);

router.get('/boots', catalogueController.getBoots);

router.get('/other', catalogueController.getOther);

router.post('/:slug/reviews', catalogueController.getReview);

module.exports = router;