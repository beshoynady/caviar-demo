const express = require('express');
const router = express.Router();
const cashMovementController = require('../controllers/CashMovement.controller');

// Routes related to Cash Movements
router.route('/')
  .post(cashMovementController.createCashMovement)
  .get(cashMovementController.getAllCashMovements);

router.route('/:id')
  .get(cashMovementController.getCashMovementById)
  .put(cashMovementController.updateCashMovement)
  .delete(cashMovementController.deleteCashMovement);

module.exports = router;
