const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    slug: String,
    imageUrl: String,
    description: String,
    price: Number,
    category: String, 
    
    orderCount:{
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('product', productSchema);
