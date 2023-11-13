const express = require("express");
const path = require("path");
// const verifyJWT = require('../middleware/verifyjwt');

const {
  createProduct,
  addRecipe,
  getAllProducts,
  getProductByCategory,
  getOneProduct,
  updateProduct,
  updateProductWithoutImage,
  deleteProduct
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

router.route('/').post(upload.single("image"), createProduct).get(getAllProducts);
router.route('/getproductbycategory/:categoryid').get(getProductByCategory)
router.route('/:productid').get(getOneProduct).put(upload.single("image"), updateProduct).delete(deleteProduct);
router.route('/withoutimage/:productid').put(updateProductWithoutImage)
router.route('/addrecipe/:productid').put(addRecipe)
// router.route('/:productid').get(getoneproduct).put(updateproduct).delete(deleteproduct);

module.exports = router;


// route.post("/create", upload.single("image"), createproduct);
// route.get("/allproducts", getAllproducts);
// route.get("/prouctsbycategory", getproductbycategory);
// route.get("/oneproduct/:productid", getoneproduct);
// route.put("/update/:productid",upload.single("image"), updateproduct);
// route.delete("/delete/:productid", deleteproduct);

// module.exports = route;
