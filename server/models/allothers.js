const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const allothersSchema = new Schema({
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
    orderCount: {
        type: Number,
        default: 0
      }
    
});

module.exports = mongoose.model('allothers', allothersSchema, 'others');