const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;


const cashMovementSchema = new mongoose.Schema({
  registerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CashRegister',
    required: true,
  },
  createBy: {
    type: ObjectId,
    ref: 'Employee',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
},{timestamps: true});

const CashMovement = mongoose.model('CashMovement', cashMovementSchema);

module.exports = CashMovement;