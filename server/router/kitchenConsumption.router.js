const express = require('express');
const router = express.Router();
const kitchenConsumptionController = require('../controllers/kitchenConsumptionController');

// Routes for kitchen consumptions
router.get('/', kitchenConsumptionController.getAllKitchenConsumptions);
router.get('/:id', kitchenConsumptionController.getKitchenConsumptionById);
router.post('/', kitchenConsumptionController.createKitchenConsumption);
router.put('/:id', kitchenConsumptionController.updateKitchenConsumptionById);
router.delete('/:id', kitchenConsumptionController.deleteKitchenConsumptionById);

module.exports = router;
