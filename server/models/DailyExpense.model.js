const mongoose = require('mongoose');

const dailyExpenseSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    expense: {
        type: ObjectId,
        ref: 'Expense', 
        required: true,
    },
    quantity: { type: Number, required: true, min: 0 },

    totalAmount: { type: Number, default: 0, min: 0 },
    notes: String,
});

const DailyExpenseModel = mongoose.model('DailyExpense', dailyExpenseSchema);

module.exports = DailyExpenseModel;
