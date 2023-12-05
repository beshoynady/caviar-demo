const express = require("express");
const path = require("path");
// const verifyJWT = require('../middleware/verifyjwt');
const authenticateToken = require('../utlits/authenticate')

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

router.route('/')
  .post(upload.single("image"), createProduct)
  .get(authenticateToken, getAllProducts);
  
router.route('/getproductbycategory/:categoryid').get(getProductByCategory)
router.route('/:productid').get(getOneProduct).put(upload.single("image"), updateProduct).delete(deleteProduct);
router.route('/withoutimage/:productid').put(updateProductWithoutImage)
router.route('/addrecipe/:productid').put(addRecipe)
// router.route('/:productid').get(getoneproduct).put(updateproduct).delete(deleteproduct);

module.exports = router;
