const express = require('express');
const router = express.Router();
const Product = require('../server/models/product'); 

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('admin/admin', { products });
    } catch (err) {
        res.status(500).send('Error loading products');
    }
});

router.post('/newproduct', async (req, res) => {
    const { name, slug, imageUrl, description, price, category } = req.body;

    try {
        const newProduct = new Product({ name, slug, imageUrl, description, price, category });
        await newProduct.save();
        res.redirect('/admin');
    } catch (err) {
        res.status(500).send('Failed to add product');
    }
});

module.exports = router;
