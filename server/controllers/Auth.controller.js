const Usermodel = require('../models/Users.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const signup = async (req, res) => {
    try {
        const username = await req.body.username;
        const email = await req.body.email;
        const address = await req.body.address;
        const phone = await req.body.phone;
        const password = await req.body.password;
        const passwordHash = await bcrypt.hash(password, 10);

        if (!username || !phone || !password || !address) {
            return res.status(404).json({ message: 'username or password or phone or address is incorrect' })
        }
        const isuserfound = await Usermodel.findOne({ phone });
        if (isuserfound) {
            return res.status(404).json({ message: 'this phone is already in use' })
        }
        const newUser = await Usermodel.create({ username, email, phone, address, password: passwordHash })

        const accessToken = jwt.sign({
            userinfo: {
                id: newUser._id,
                isAdmin: newUser.isAdmin,
                role: newUser.role
            }
        }, process.env.jwt_secret_key,
            { expiresIn: process.env.jwt_expire }
        )
        res.status(200).json({ accessToken, newUser })
    } catch (err) {
        res.status(404).json(err.message);
    }
}

const login = async (req, res) => {
    try {
        const phone = await req.body.phone;
        const password = await req.body.password;

        if (!phone || !password) {
            return res.status(404).json({ message: 'phone or password is required' });
        }


        const finduser = await Usermodel.findOne({ phone: phone });
        if (!finduser) {
            return res.status(400).json({ message: 'this user not founded' })
        } else {
            const match = bcrypt.compare(password, finduser.password, function(err, result) {
                if (!result) {
                    return res.status(401).json({ message: "Wrong Password" })
                } else {
                    const accessToken = jwt.sign({
                        userinfo: {
                            id: finduser._id,
                            isAdmin: finduser.isAdmin,
                            role: finduser.role
                        }
                    }, process.env.jwt_secret_key,
                        { expiresIn: process.env.jwt_expire }
                    )
                    if (!accessToken) {
                        return res.status(401).json({ message: "accessToken not sign" })
                    }
    
                    res.status(200).json({ finduser, accessToken })
    
                }          
            });

        }



        // res.status(200).json(finduser)
    } catch (error) {
        res.status(404).send('error');
    }
}

// const refresh = (req, res) => {
//     const cookies = req.cookies;
//     if (!cookies?.jwt) res.status(401).json({ message: "Unauthorized" });
//     const refreshToken = cookies.jwt;
//     jwt.verify(
//         accessToken,
//         process.env.jwt_secret_key,
//         async (err, decoded) => {
//             if (err) return res.status(403).json({ message: "Forbidden" });
//             const foundUser = await Usermodel.findById(decoded.userinfo.id).exec();
//             if (!foundUser) return res.status(401).json({ message: "Unauthorized" });
//             const accessToken = jwt.sign(
//                 {
//                     userinfo: {
//                         id: foundUser._id,
//                     },
//                 },
//                 process.env.ACCESS_TOKEN_SECRET,
//                 { expiresIn: "15m" }
//             );
//             res.json({ accessToken });
//         }
//     );
// };
// const logout = (req, res) => {
//     const cookies = req.cookies;
//     if (!cookies?.jwt) return res.sendStatus(204); //No content
//     res.clearCookie("jwt", {
//         httpOnly: true,
//         sameSite: "None",
//         secure: true,
//     });
//     res.json({ message: "Cookie cleared" });
// };


// module.exports = { signup, login, refresh, logout }
module.exports = { signup, login }