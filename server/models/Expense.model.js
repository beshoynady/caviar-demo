const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
}, { timestamps: true });

const ExpenseModel = mongoose.model('Expense', expenseSchema);

module.exports = ExpenseModel;
