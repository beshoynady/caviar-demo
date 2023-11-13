const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/expensesController');


router.route("/").post(expensesController.addExpense).get(expensesController.getAllExpenses);
router.route("/:expenseId").get( expensesController.getExpenseById).put(expensesController.updateExpense).delete(expensesController.deleteExpense);


// // Get all expenses
// router.get('/', expensesController.getAllExpenses);

// // Get one expense by ID
// router.get('/:expenseId', expensesController.getExpenseById);

// // Add a new expense
// router.post('/', expensesController.addExpense);

// // Update an expense by ID
// router.put('/:expenseId', expensesController.updateExpense);

// // Delete an expense by ID
// router.delete('/:expenseId', expensesController.deleteExpense);

module.exports = router;
