const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    slug: String,
    imageUrl: String,
    description: String,
    price: Number,
    category: String, 
});

module.exports = mongoose.model('product', productSchema);
