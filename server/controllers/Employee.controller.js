const Employeemodel = require('../models/Employee.model.js')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// const hash = (password) =>{
//     const saltRounds = 10;
//     const salt = bcrypt.genSaltSync(saltRounds);
//     const hash = bcrypt.hashSync(password, salt);
//     return hash
// }


const createEmployee = async (req, res, next) => {
    try {
        const fullname = await req.body.fullname;
        const numberID = await req.body.numberID;
        const username = await req.body.username;
        const email = await req.body.email;
        const address = await req.body.address;
        const phone = await req.body.phone;
        const basicSalary = await req.body.basicSalary;
        const payRole = await req.body.payRole;
        const role = await req.body.role;
        const isActive = await req.body.isActive;

        const pass = await req.body.password;
        const password = await bcrypt.hash(pass, 10);

        if (!fullname || !phone || !pass) {
            return res.status(404).json({ message: 'fullname or pass or phone is incorrect' })
        }
        const isemployeefound = await Employeemodel.findOne({ phone });
        if (isemployeefound) {
            return res.status(404).json({ message: 'this phone is already in use' })
        }
        const newEmployee = await Employeemodel.create({ fullname, username, numberID, email, phone, address, password, basicSalary, payRole, role, isActive })
        newEmployee.save()
        const accessToken = jwt.sign({
            employeeinfo: {
                id: newEmployee._id,
                username: newEmployee.username,
                isAdmin: newEmployee.isAdmin,
                isActive: newEmployee.isActive,
                role: newEmployee.role
            }
        }, process.env.jwt_secret_key,
            { expiresIn: process.env.jwt_expire }
        )
        res.status(200).json({ accessToken, newEmployee })
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

const getoneEmployee = async (req, res) => {
    try {
        const employeeId = await req.params.employeeId;
        const employee = await Employeemodel.findById(employeeId);
        res.status(200).json(employee);
    } catch (err) {
        res.status(400).json(err)
    }
}

const loginEmployee = async (req, res) => {
    try {
        const phone = await req.body.phone;
        const password = await req.body.password;

        if (!phone || !password) {
            return res.status(404).json({ message: 'phone or password is required' });
        }


        const findEmployee = await Employeemodel.findOne({ phone: phone });
        if (!findEmployee) {
            return res.status(400).json({ message: 'this Employee not founded' })
        } else {
            const match = bcrypt.compare(password, findEmployee.password, function (err, result) {
                if (!result) {
                    return res.status(401).json({ message: "Wrong Password" })
                } else {
                    const accessToken = jwt.sign({
                        Employeeinfo: {
                            id: findEmployee._id,
                            isAdmin: findEmployee.isAdmin,
                            role: findEmployee.role
                        }
                    }, process.env.jwt_secret_key,
                        { expiresIn: process.env.jwt_expire }
                    )
                    if (!accessToken) {
                        return res.status(401).json({ message: "accessToken not sign" })
                    }

                    res.status(200).json({ findEmployee, accessToken })

                }
            });

        }
        // res.status(200).json(findEmployee)
    } catch (error) {
        res.status(404).send('error');
    }
}



const getallEmployees = async (req, res) => {
    try {
        const allemployees = await Employeemodel.find({});
        res.status(200).json(allemployees);
    } catch (err) {
        res.status(400).json(err)
    }
}

const updateEmployee = async (req, res) => {
    try {
        const id = req.params.employeeId;
        const fullname = await req.body.fullname;
        const numberID = await req.body.numberID;
        const username = await req.body.username;
        const email = await req.body.email;
        const address = await req.body.address;
        const phone = await req.body.phone;
        const basicSalary = await req.body.basicSalary;
        const payRole = await req.body.payRole;
        const role = await req.body.role;
        const isAdmin = await req.body.isAdmin;
        const isActive = await req.body.isActive;

        const pass = await req.body.password;

        if (!phone) {
            return res.status(404).json({ message: 'username or phone is incorrect' })
        }

        const isemployeefound = await Employeemodel.findOne({ phone });
        if (!isemployeefound) {
            return res.status(404).json({ message: 'this employee not found' })
        }
        if (pass) {
            const password = await bcrypt.hash(pass, 10);
            const updateemployee = await Employeemodel.findByIdAndUpdate(id, { fullname, username, numberID, email, phone, salary, address, password, basicSalary, payRole, isActive, isAdmin, role }, { new: true });
            updateemployee.save()
            res.status(200).json(updateemployee)
        } else {
            const updateemployee = await Employeemodel.findByIdAndUpdate(id, { fullname, username, numberID, email, phone, salary, address, basicSalary, payRole, isActive, isAdmin, role }, { new: true });
            updateemployee.save()
            res.status(200).json(updateemployee)
        }
        const accessToken = jwt.sign({
            employeeinfo: {
                id: newEmployee._id,
                username: newEmployee._username,
                isAdmin: newEmployee.isAdmin,
                isActive: newEmployee.isActive,
                role: newEmployee.role
            }
        }, process.env.jwt_secret_key,
            { expiresIn: process.env.jwt_expire }
        )
        res.status(200).json({ accessToken, updateemployee })
    } catch (err) { res.status(400).json(err) }
}


const deleteEmployee = async (req, res) => {
    const id = await req.params.employeeId;
    try {
        const employeedeleted = await Employeemodel.findByIdAndDelete(id).exec();
        if (employeedeleted) {
            return res.status(200).send("employee deleted successfully").json(employeedeleted);
        } else {
            return res.status(404).json({ "Error message": "Requested employee not found or already deleted!" })
        };
    } catch (error) {
        res.status(500).json(error)

    }
}

module.exports = {createEmployee, getoneEmployee, loginEmployee, getallEmployees, updateEmployee, deleteEmployee };
