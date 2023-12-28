const express = require('express');
const router = express.Router();
const {getAllKitchenConsumptions,
    getKitchenConsumptionById,
    createKitchenConsumption,
    updateKitchenConsumptionById,
    deleteKitchenConsumptionById} = require('../controllers/kitchenConsumption.controller');

// Routes for kitchen consumptions
router.get('/', getAllKitchenConsumptions);
router.get('/:id', getKitchenConsumptionById);
router.post('/', createKitchenConsumption);
router.put('/:id', updateKitchenConsumptionById);
router.delete('/:id', deleteKitchenConsumptionById);

module.exports = router;
