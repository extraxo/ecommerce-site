const mongoose = require('mongoose');

const bootSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  sizes: {
    type: [String],
    default: ['40', '41', '42', '43', '44']
  },
  benefits: [{
    type: String,
    trim: true
  }],
  details: [{
    type: String,
    trim: true
  }]
});

module.exports = mongoose.model('others', bootSchema, 'other');
