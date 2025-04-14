const mongoose = require('mongoose');7

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  name: {
      type: String,
      required: true,
      trim: true
  },
  rating: { 
      type: Number,
      required: true,
      min: 1,
      max: 5
  },
  comment: {
      type: String,
      required: true,
      trim: true
  }
}, {
  timestamps: true 
});

const bootSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
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
  }],

  reviews: [reviewSchema],
});

module.exports = mongoose.model('Boot', bootSchema, 'boot');
