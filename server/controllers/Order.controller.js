const OrderModel = require('../models/Order.model')


const createorder = async (req, res) => {
    const serial = await req.body.serial;
    const ordernum = await req.body.ordernum;
    const products = await req.body.products;
    const table = await req.body.table;
    const user = await req.body.user;
    const total = await req.body.total;
    const order_type = await req.body.order_type;
    const notes = await req.body.notes;
    const help = await req.body.help;
    const employee = await req.body.employee
    const name = await req.body.name
    const phone = await req.body.phone
    const address = await req.body.address

    try {
        const neworder = await OrderModel.create({
            serial,
            ordernum,
            products,
            table,
            user,
            total,
            order_type,
            notes,
            help,
            employee,
            name,
            phone,
            address
        });
        neworder.save();
        res.status(200).json(neworder)
    } catch (err) {
        res.json(err).status(400)
    }
}


const getorder = async (req, res) => {
    const orderid = await req.params.id
    try {
        const order = await OrderModel.findById(orderid)
        res.status(200).json(order)
    } catch (err) {
        res.status(400).json(err)
    }
}



const getorders = async (req, res) => {
    try {
        const orders = await OrderModel.find()
        res.status(200).json(orders)
    } catch (err) {
        res.status(400).json(err)
    }
}
const updateorder = async (req, res) => {
    const orderid = await req.params.id;
    const products = await req.body.products;
    const table = await req.body.tableid;
    const user = await req.body.userid;
    const total = await req.body.total;
    const status = await req.body.status;
    const payment_status = await req.body.payment_status;
    const isActive = await req.body.isActive;
    const order_type = await req.body.order_type
    const notes = await req.body.notes
    const waiter = await req.body.waiter
    const help = await req.body.help
    const employee = await req.body.employee
    try {
        const updatedorder = await OrderModel.findByIdAndUpdate(orderid, {
            products,
            table,
            user,
            total,
            status,
            payment_status,
            help,
            isActive,
            employee,
            order_type,
            notes,
            waiter
        })
        updatedorder.save();
        res.status(200).json(updatedorder)
    } catch (err) {
        res.status(400).json(err)
    }
}

// const addproduct=async()=>{
//     const orderid = req.params.id;
//     const products = req.body.products;
//     try{
//         const addorder = await OrderModel.findByIdAndUpdate(orderid,{$push:{
//             products:products}
//             })
//             addorder.save();
//             res.status(200).json(addorder)
//     }catch(err){
//         res.status(400).json(err)
//         }
// }

const deleteorder = async (req, res) => {
    const orderid = req.params.id;
    try {
        const deletedorder = await OrderModel.findByIdAndDelete(orderid)
        res.status(200).json(deletedorder)
    } catch (err) {
        res.status(400).json(err)
    }
}

module.exports = {
    createorder,
    getorder,
    getorders,
    updateorder,
    deleteorder
}



