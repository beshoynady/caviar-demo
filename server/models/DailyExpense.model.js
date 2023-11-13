const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

// Define the schema for daily expenses
const dailyExpenseSchema = new mongoose.Schema({
    expenseID: {
        type: ObjectId,
        ref: 'Expense', 
        required: true,
    },
    expenseDescription: {
        type: String,
        required: true,
    },
    quantity: { type: Number, required: true, min: 0 },
    
    totalAmount: { type: Number, required: true, min: 0 },
    notes: String,
    date: { 
        type: Date, 
        default: Date.now 
    },
});

// Create a model based on the schema
const DailyExpenseModel = mongoose.model('DailyExpense', dailyExpenseSchema);

// Export the model
module.exports = DailyExpenseModel;
