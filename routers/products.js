const express = require('express');
const router = express.Router();
const allkits = require('../server/models/allkits');
const allboots = require('../server/models/allboots');
const allothers = require('../server/models/allothers');

router.get('/kits', async (req, res) => {
    try {
        const allKits = await allkits.find({}); 
        if (!allKits || allKits.length === 0) {
            return res.status(404).send('No kits found');
        }
        res.render('kits', { kits: allKits }); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/boots', async (req, res) => {
    try {
        const allBoots = await allboots.find({}); 
        if (!allBoots || allBoots.length === 0) {
            return res.status(404).send('No boots found');
        }
        res.render('boots', { boots: allBoots }); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/other', async (req, res) => {
    try {
        const allOthers = await allothers.find({}); 
        if (!allOthers || allOthers.length === 0) {
            return res.status(404).send('No others found');
        }
        res.render('other', { others: allOthers }); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;