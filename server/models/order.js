const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  customerSurname: {
    type: String,
    required: true
  },
  customerEmail:{
    type: String,
    required: true,
  },
  
  customerAddress: {
    type: String,
    required: true
  },
  items: [{
    id: String,
    name: String,
    size: String,
    playerInfo: String,
    badgesInfo: String,
    basePrice: Number,
    totalPrice: Number,
    quantity: Number,
    category: String
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Order', orderSchema);