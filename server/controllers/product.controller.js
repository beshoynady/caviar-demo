const Productmodel = require('../models/Product.model.js');

const createProduct = async (req, res) => {
    try {
        const { productname, productprice, productdescription, productcategoryid } = req.body;
        const image = req.file ? req.file.filename : null;

        const newProduct = await Productmodel.create({
            name: productname,
            description: productdescription,
            price: productprice,
            image: image,
            category: productcategoryid
        });

        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const addRecipe = async (req, res) => {
    try {
        const productId = req.params.productid;
        const { Recipe, totalcost } = req.body;

        const productRecipe = await Productmodel.findByIdAndUpdate(
            { _id: productId },
            { Recipe, totalcost },
            { new: true }
        );

        res.status(200).json({ Recipe: productRecipe });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllProducts = async (_req, res) => {
    try {
        const allProducts = await Productmodel.find({});
        res.status(200).json(allProducts);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getProductByCategory = async (req, res) => {
    try {
        const categoryid = req.params.categoryid;
        const products = await Productmodel.find({ category: categoryid });
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getOneProduct = async (req, res) => {
    try {
        const productid = req.params.productid;
        const oneProduct = await Productmodel.findById(productid);
        res.status(200).json(oneProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const productid = req.params.productid;
        const { productname, productprice, productdescription, productcategoryid, productdiscount, sales } = req.body;
        const image = req.file ? req.file.filename : null;

        const updatedProduct = await Productmodel.findByIdAndUpdate(
            { _id: productid },
            {
                name: productname,
                description: productdescription,
                price: productprice,
                category: productcategoryid,
                discount: productdiscount,
                sales: sales,
                image: image
            },
            { new: true }
        );

        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateProductWithoutImage = async (req, res) => {
    try {
        const productid = req.params.productid;
        const { productname, productprice, productdescription, productcategoryid, productdiscount, sales } = req.body;

        const updatedProduct = await Productmodel.findByIdAndUpdate(
            { _id: productid },
            {
                name: productname,
                description: productdescription,
                price: productprice,
                category: productcategoryid,
                discount: productdiscount,
                sales: sales
            },
            { new: true }
        );

        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productid = req.params.productid;
        const productdelete = await Productmodel.findByIdAndDelete(productid);
        res.status(200).json({ message: 'Product deleted successfully', deletedProduct: productdelete });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    createProduct,
    addRecipe,
    getAllProducts,
    getProductByCategory,
    getOneProduct,
    updateProduct,
    updateProductWithoutImage,
    deleteProduct
};
