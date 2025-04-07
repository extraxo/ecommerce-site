const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const kitSchema = new mongoose.Schema({
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
    subtitle: {
      type: String,
      trim: true
    },
    kitType: {
      type: String,
      enum: ['Home', 'Away', 'Third', 'Goalkeeper'],
      default: 'Home'
    },
    season: {
      type: String,
      trim: true
    },
    availableSizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL']
    },
    players: [{
      name: String,
      number: Number,
      additionalPrice: Number
    }],
    badgeOptions: {
      available: Boolean,
      additionalPrice: Number
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

module.exports = mongoose.model('Kit', kitSchema, 'kit');