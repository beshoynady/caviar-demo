const Employeemodel = require('../models/Employee.model.js')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Joi = require('joi');

const createEmployeeSchema = Joi.object({
    fullname: Joi.string().min(3).max(100).required(),
    numberID: Joi.string().length(14).required(),
    username: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    address: Joi.string().min(3).max(150),
    phone: Joi.string().length(11).required(),
    password: Joi.string().min(3).required(),
    basicSalary: Joi.number().min(0).required(),
    sectionNumber: Joi.number().min(1),
    role: Joi.string().valid('manager', 'casher', 'waiter', 'deliveryman', 'chef').required(),
    isActive: Joi.boolean().required(),
});

const updateEmployeeSchema = Joi.object({
    fullname: Joi.string().min(3).max(100),
    numberID: Joi.string().length(14),
    username: Joi.string().min(3).max(100),
    email: Joi.string().email(),
    address: Joi.string().min(3).max(150),
    phone: Joi.string().length(11),
    password: Joi.string().min(3),
    basicSalary: Joi.number().min(0),
    sectionNumber: Joi.number().min(1),
    role: Joi.string().valid('manager', 'casher', 'waiter', 'deliveryman', 'chef'),
    isActive: Joi.boolean(),
});

const createEmployee = async (req, res, next) => {
    try {
        const { error } = createEmployeeSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        // Destructuring request body for required employee details
        const { fullname, numberID, username, email, address, phone, basicSalary, role, sectionNumber, isActive } = req.body;

        // Destructuring request body for optional employee details
        const pass = req.body.password;
        const password = await bcrypt.hash(pass, 10);

        if (!fullname || !phone || !pass) {
            return res.status(400).json({ message: 'Invalid input: Fullname, Phone, or Password missing' });
        }

        const isEmployeeFound = await Employeemodel.findOne({ phone });
        if (isEmployeeFound) {
            return res.status(409).json({ message: 'This phone is already in use' });
        }

        const newEmployee = await Employeemodel.create({
            fullname,
            username,
            numberID,
            email,
            phone,
            address,
            password,
            basicSalary,
            role,
            sectionNumber,
            isActive,
        });

        // Generating JWT token
        const accessToken = jwt.sign({
            employeeinfo: {
                id: newEmployee._id,
                username: newEmployee.username,
                isAdmin: newEmployee.isAdmin,
                isActive: newEmployee.isActive,
                role: newEmployee.role,
            }
        }, process.env.jwt_secret_key, { expiresIn: process.env.jwt_expire });

        res.status(201).json({ accessToken, newEmployee });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

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
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ message: 'Phone number and password are required' });
        }

        const findEmployee = await Employeemodel.findOne({ phone });

        if (!findEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const match = await bcrypt.compare(password, findEmployee.password);

        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign(
            {
                employeeinfo: {
                    id: findEmployee._id,
                    username: findEmployee.username,
                    isAdmin: findEmployee.isAdmin,
                    isActive: findEmployee.isActive,
                    role: findEmployee.role
                }
            },
            process.env.jwt_secret_key,
            { expiresIn: process.env.jwt_expire }
        );

        if (!accessToken) {
            return res.status(500).json({ message: 'Failed to generate access token' });
        }

        res.status(200).json({ findEmployee, accessToken, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};



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
        const { error } = updateEmployeeSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const id = req.params.employeeId;
        const { fullname, numberID, username, email, address, phone, basicSalary, role, sectionNumber, isActive, password } = req.body;

        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        const updateData = password ? { fullname, numberID, username, email, address, phone, password: hashedPassword, basicSalary, isActive, role ,sectionNumber } : { fullname, numberID, username, email, address, phone, basicSalary, isActive, role, sectionNumber };

        const updateEmployee = await Employeemodel.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json(updateEmployee);
    } catch (err) {
        res.status(400).json(err);
    }
};



const deleteEmployee = async (req, res) => {
    try {
        const id = await req.params.employeeId;
        const employeedeleted = await Employeemodel.findByIdAndDelete(id).exec();

    } catch (error) {
        res.status(500).json(error)

    }
}



const validatePayroll = (data) => {
    const schema = Joi.object({
      month: Joi.number(),
      salary: Joi.number().min(0),
      additional: Joi.number().min(0),
      bonus: Joi.number().min(0),
      totalDue: Joi.number().min(0),
      absence: Joi.number().min(0),
      deduction: Joi.number().min(0),
      predecessor: Joi.number().min(0),
      insurance: Joi.number().min(0),
      tax: Joi.number().min(0),
      totalDeductible: Joi.number().min(0),
      netSalary: Joi.number().min(0),
      isPaid: Joi.boolean(),
      paidBy: Joi.string()
    });
  
    return schema.validate(data);
  };
  
  const updateOrAddPayrollForMonth = async (req, res) => {
    try {
      const { error } = validatePayroll(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      const employeeId = req.params.employeeId;
      const {
        month,
        salary,
        additional,
        bonus,
        totalDue,
        absence,
        deduction,
        predecessor,
        insurance,
        tax,
        totalDeductible,
        netSalary,
        isPaid,
        paidBy
      } = req.body;
  
      const employee = await Employeemodel.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      let found = false;
      employee.payRoll.forEach((payroll) => {
        if (payroll.Month === month && !payroll.isPaid) {
          found = true;
          payroll.salary = salary;
          payroll.Additional = additional;
          payroll.Bonus = bonus;
          payroll.TotalDue = totalDue;
          payroll.Absence = absence;
          payroll.Deduction = deduction;
          payroll.Predecessor = predecessor;
          payroll.Insurance = insurance;
          payroll.Tax = tax;
          payroll.TotalDeductible = totalDeductible;
          payroll.NetSalary = netSalary;
          payroll.isPaid = isPaid;
          payroll.paidBy = paidBy;
        }
      });
  
      if (!found) {
        employee.payRoll.push({
          Month: month,
          salary: salary,
          Additional: additional,
          Bonus: bonus,
          TotalDue: totalDue,
          Absence: absence,
          Deduction: deduction,
          Predecessor: predecessor,
          Insurance: insurance,
          Tax: tax,
          TotalDeductible: totalDeductible,
          NetSalary: netSalary,
        });
      }
  
      await employee.save();
      res.status(200).json({ message: 'Payroll information updated for the month', payroll: employee.payRoll });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


module.exports = { createEmployee, getoneEmployee, loginEmployee,updateOrAddPayrollForMonth, getallEmployees, updateEmployee, deleteEmployee };
