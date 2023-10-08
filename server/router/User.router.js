const express = require("express");
const { createuser, getoneuser, getallusers, updateuser, deleteuser } = require('../controllers/User.controller.js')
// const verifyJWT = require('../middleware/verifyjwt');


const router = express.Router();

// router.use(verifyJWT)

router.route('/').post(createuser).get(getallusers);
router.route('/:userid').get(getoneuser).put(updateuser).delete(deleteuser);
module.exports = router;


// route.post("/create", createuser);
// route.get("/allusers", getallusers);
// route.get("/:userid", getoneuser);
// route.put("/update/:userid", updateuser);
// route.delete("/delete/:userid", deleteuser);

// module.exports = route;
