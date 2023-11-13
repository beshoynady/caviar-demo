const express = require("express");
const {
    createEmployee,
    getoneEmployee,
    loginEmployee,
    payRollEmployee,
    getallEmployees,
    updateEmployee,
    deleteEmployee
} = require('../controllers/Employee.controller.js')
// const verifyJWT = require('../middleware/verifyjwt');


const router = express.Router();

// router.use(verifyJWT)


router.route('/').post(createEmployee).get(getallEmployees);
router.route('/:employeeid').get(getoneEmployee).put(updateEmployee).delete(deleteEmployee);
router.route('/login').post(loginEmployee);
router.route('/payroll/:employeeid').put(payRollEmployee);
module.exports = router;


// route.post("/create", createEmployee);
// route.get("/allEmployees", getallEmployees);
// route.get("/:Employeeid", getoneEmployee);
// route.put("/update/:Employeeid", updateEmployee);
// route.delete("/delete/:Employeeid", deleteEmployee);

// module.exports = route;
