const Productmodel = require('../models/Product.model.js')


const createproduct = async (req, res) => {
    try {
        const productname = await req.body.productname;
        const productprice = await req.body.productprice;
        const productdescription = await req.body.productdescription;
        const image = await req.file.filename;
        const categoryid = await req.body.productcategoryid;

        const newproduct = await Productmodel.create({ name: productname, description: productdescription, price: productprice, image: image, category: categoryid });
        newproduct.save();
        res.status(200).json(newproduct);
    } catch (err) {
        res.status(400).json(err)
    }
}

const getAllproducts = async (req, res) => {
    try {
        const allproducts = await Productmodel.find({});
        res.status(200).json(allproducts);
    } catch (err) {
        res.status(400).json(err)
    }
}

const getproductbycategory = async (req, res, next) => {
    try {
        const categoryid = await req.query.categoryid;
        const products = await Productmodel.find({ category: categoryid });
        res.status(200).json(products)
    } catch (err) {
        res.status(400).json(err)
    }
}

const getoneproduct = async (req, res) => {
    try {
        const productid = req.params.productid;
        const oneproduct = await Productmodel.findById(productid);
        res.status(200).json(oneproduct);
    } catch (err) {
        res.status(400).json(err)
    }
}

const updateproduct = async (req, res) => {
    try {
        const productid = await req.params.productid;
        const name = await req.body.productname;
        const price = await req.body.productprice;
        const description = await req.body.productdescription;
        const category = await req.body.productcategoryid;
        const discount = await req.body.productdiscount;
        const sales = await req.body.sales;
        const image = await req.file.filename;
        const product = await Productmodel.findByIdAndUpdate({ _id: productid }, { name, description, price, category, discount, sales, image }, { new: true })
        res.status(200).json(product)
    } catch (err) {
        res.status(400).json(err)
    }
}
const updateproductwithoutimage = async (req, res) => {
    try {
        const productid = await req.params.productid;
        const name = await req.body.productname;
        const price = await req.body.productprice;
        const description = await req.body.productdescription;
        const category = await req.body.productcategoryid;
        const discount = await req.body.productdiscount;
        const sales = await req.body.sales;
        const product = await Productmodel.findByIdAndUpdate({ _id: productid }, { name, description, price, category, discount, sales }, { new: true })
        res.status(200).json(product)
    } catch (err) {
        res.status(400).json(err)
    }
}

const deleteproduct = async (req, res) => {
    try {
        const productid = await req.params.productid;
        const productdelete = await Productmodel.findByIdAndDelete(productid);
        res.status(200).send("product deleted successfully").json(productdelete);
    } catch (err) {
        res.status(400)
    }
}



module.exports = { createproduct, getAllproducts, getproductbycategory, getoneproduct, updateproduct, updateproductwithoutimage, deleteproduct }