const express = require('express');
const router = express.Router();
const dailyExpensesController = require('../controllers/DailyExpense.controller');

// Get all daily expenses
router.get('/', dailyExpensesController.getAllDailyExpenses);

// Get one daily expense by ID
router.get('/:dailyExpenseId', dailyExpensesController.getDailyExpenseById);

// Add a new daily expense
router.post('/', dailyExpensesController.addDailyExpense);

// Update a daily expense by ID
router.put('/:dailyExpenseId', dailyExpensesController.updateDailyExpense);

// Delete a daily expense by ID
router.delete('/:dailyExpenseId', dailyExpensesController.deleteDailyExpense);

module.exports = router;
