const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const allbootsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    
});

module.exports = mongoose.model('allboots', allbootsSchema, 'boots');