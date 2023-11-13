const ExpenseModel = require('../models/Expense.model');

// Get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await ExpenseModel.find();
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get one expense by ID
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await ExpenseModel.findById(req.params.expenseId);
    if (expense) {
      res.status(200).json(expense);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new expense
exports.addExpense = async (req, res) => {
  const expense = new Expense({
    description: req.body.description,
    amount: req.body.amount
  });

  try {
    const savedExpense = await ExpenseModel.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update an expense by ID
exports.updateExpense = async (req, res) => {
  try {
    const updatedExpense = await ExpenseModel.updateOne(
      { _id: req.params.expenseId },
      { $set: { description: req.body.description, amount: req.body.amount } }
    );
    if (updatedExpense.nModified > 0) {
      res.status(200).json(updatedExpense);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an expense by ID
exports.deleteExpense = async (req, res) => {
  try {
    const removedExpense = await ExpenseModel.remove({ _id: req.params.expenseId });
    if (removedExpense.deletedCount > 0) {
      res.status(200).json(removedExpense);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
