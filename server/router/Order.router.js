const express = require("express");
const jwt = require('jsonwebtoken');
// const verifyJWT = require('../middleware/verifyjwt');
const router = express.Router();
require('dotenv').config();

// router.use(verifyJWT)
const {
    createOrder,
    getOrder,
    getOrders,
    updateOrder,
    deleteOrder
} = require("../controllers/Order.controller");


const secretKey = process.env.jwt_secret_key; // Replace with your secret key

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
};

router.route("/").post(authenticateToken,createOrder).get(getOrders);
router.route("/:id").get(getOrder).put(updateOrder).delete(deleteOrder);
module.exports = router;