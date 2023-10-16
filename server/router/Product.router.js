const express = require("express");
const path = require("path");
// const verifyJWT = require('../middleware/verifyjwt');

const {
  createproduct,
  getAllproducts,
  getproductbycategory,
  getoneproduct,
  updateproduct,
  deleteproduct,
  updateproductwithoutimage
} = require("../controllers/product.controller");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = new Date().toISOString().replace(/:/g, "-");
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

// router.use(verifyJWT)

router.route('/').post(upload.single("image"), createproduct).get(getAllproducts);
router.route('/:productid').get(getoneproduct).put(upload.single("image"), updateproduct).delete(deleteproduct);
router.route('/withoutimage/:productid').put(updateproductwithoutimage)
// router.route('/:productid').get(getoneproduct).put(updateproduct).delete(deleteproduct);

module.exports = router;


// route.post("/create", upload.single("image"), createproduct);
// route.get("/allproducts", getAllproducts);
// route.get("/prouctsbycategory", getproductbycategory);
// route.get("/oneproduct/:productid", getoneproduct);
// route.put("/update/:productid",upload.single("image"), updateproduct);
// route.delete("/delete/:productid", deleteproduct);

// module.exports = route;
