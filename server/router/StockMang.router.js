const express = require('express');
const {createStockAction, UpdateStockAction,getoneStockActions, getAllStockActions, DeleteStockAction } = require('../controllers/StockMang.controller');

const router = express.Router();

router.route('/').post(createStockAction).get(getAllStockActions)
router.route('/:actionid').get(getoneStockActions).put(UpdateStockAction).delete(DeleteStockAction)

module.exports = router;
