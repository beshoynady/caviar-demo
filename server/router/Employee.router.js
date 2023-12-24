const express = require("express");
const router = express.Router();
const employeesController = require('../controllers/Employee.controller.js');

router.route('/')
    .post(employeesController.createEmployee)
    .get(employeesController.getallEmployees);

router.route('/:employeeId')
    .get(employeesController.getoneEmployee)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee);

router.route('/login').post(employeesController.loginEmployee);

router.route('/payroll/:employeeId')
    .put(employeesController.paidPayrollForMonth);

// router.route('/paid/:employeeId')
//     .put(employeesController.paidPayrollForMonth);

module.exports = router;
