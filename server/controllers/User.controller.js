const Usermodel = require('../models/Users.model.js')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// const hash = (password) =>{
//     const saltRounds = 10;
//     const salt = bcrypt.genSaltSync(saltRounds);
//     const hash = bcrypt.hashSync(password, salt);
//     return hash
// }


const createuser = async (req, res, next) => {
    try {
        const username = await req.body.username;
        const email = await req.body.email;
        const address = await req.body.address;
        const salary = await req.body.salary;
        const phone = await req.body.phone;
        const role = await req.body.role;
        const isAdmin = await req.body.isAdmin;

        const pass = await req.body.password;
        const password = await bcrypt.hash(pass, 10);

        if (!username || !phone || !password || !pass) {
            return res.status(404).json({ message: 'username or password or phone or address is incorrect' })
        }
        const isuserfound = await Usermodel.findOne({ phone });
        if (isuserfound) {
            return res.status(404).json({ message: 'this phone is already in use' })
        }
        const newUser = await Usermodel.create({ username, email, phone, salary, address, password, isAdmin, role })
        const accessToken = jwt.sign({
            userinfo: {
                id: newUser._id,
                isAdmin: newUser.isAdmin,
                isActive: newUser.isActive,
                role: newUser.role
            }
        }, process.env.jwt_secret_key,
            { expiresIn: process.env.jwt_expire }
        )
        res.status(200).json({ accessToken, newUser })
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

const getoneuser = async (req, res) => {
    try {
        const userid = await req.params.userid;
        const user = await Usermodel.findById(userid);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json(err)
    }
}
const getallusers = async (req, res) => {
    try {
        const allusers = await Usermodel.find({});
        res.status(200).json(allusers);
    } catch (err) {
        res.status(400).json(err)
    }
}

const updateuser = async (req, res) => {
    try {
        const id = req.params.userid;
        const username = await req.body.username;
        const email = await req.body.email;
        const address = await req.body.address;
        const salary = await req.body.salary;
        const phone = await req.body.phone;
        const role = await req.body.role;
        const isAdmin = await req.body.isAdmin;
        const isActive = await req.body.isActive;

        const pass = await req.body.password;
        
        if (!username || !phone ) {
            return res.status(404).json({ message: 'username or phone is incorrect' })
        }

        const isuserfound = await Usermodel.findOne({ phone });
        if (!isuserfound) {
            return res.status(404).json({ message: 'this user not found' })
        }
        if(pass){
            const password = await bcrypt.hash(pass, 10);
            const updateuser = await Usermodel.findByIdAndUpdate(id, { username, email, phone, salary, address, password, isAdmin,isActive, role }, { new: true });
            res.status(200).json(updateuser)
        }else{
            const updateuser = await Usermodel.findByIdAndUpdate(id, { username, email, phone, salary, address, isAdmin,isActive, role }, { new: true });
            res.status(200).json(updateuser)
        }
        const accessToken = jwt.sign({
            userinfo: {
                id: newUser._id,
                isAdmin: newUser.isAdmin,
                isActive: newUser.isActive,
                role: newUser.role
            }
        }, process.env.jwt_secret_key,
            { expiresIn: process.env.jwt_expire }
        )
        res.status(200).json({ accessToken, updateuser })
    } catch (err) { res.status(400).json(err) }
}


const deleteuser = async (req, res) => {
    const id = await req.params.userid;
    try {
        const userdeleted = await Usermodel.findByIdAndDelete(id).exec();
        if (userdeleted) {
            return res.status(200).send("user deleted successfully").json(userdeleted);
        } else {
            return res.status(404).json({ "Error message": "Requested user not found or already deleted!" })
        };
    } catch (error) {
        res.status(500).json(error)

    }
}

module.exports = { createuser, getoneuser, getallusers, updateuser, deleteuser };
