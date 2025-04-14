const express = require('express');
const router = express.Router();
const allkits = require('../server/models/allkits');
const allboots = require('../server/models/allboots');
const allothers = require('../server/models/allothers');
const Kit = require('../server/models/kit');
const Boot = require('../server/models/boot');
const Other = require('../server/models/other');

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

router.post('/:slug/reviews', async (req, res) => {
    try {
        const productSlug = req.params.slug;
        const { name, rating, comment } = req.body;

        if (!name || !rating || !comment) {
            return res.status(400).json({ message: 'Name, rating, and comment are required.' });
        }

        let product = null;
        let modelType = null;

        product = await Kit.findOne({ slug: productSlug });
        if (product) {
            modelType = "kit";
        }

        if (!product) {
            product = await Boot.findOne({ slug: productSlug });
            if (product) {
                modelType = "boot";
            }
        }

        if (!product) {
            product = await Other.findOne({ slug: productSlug });
            if (product) {
                modelType = "other";
            }
        }

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        if (!product.reviews) {
            product.reviews = [];
        }

        const newReview = {
            name: name,
            rating: parseInt(rating, 10),
            comment: comment,
        };
        
        product.reviews.push(newReview);
        
        await product.save();

        const savedReview = product.reviews[product.reviews.length - 1];

        res.status(201).json({
            ...savedReview.toObject ? savedReview.toObject() : savedReview,
            productType: modelType 
        });

    } catch (err) {
        console.error("Error saving review:", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation failed', errors: err.errors });
        }
        res.status(500).json({ message: 'Server error saving review.' });
    }
});

module.exports = router;