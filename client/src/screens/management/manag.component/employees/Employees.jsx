import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Joi = require('joi');


const Employees = () => {

  const [listofemployee, setlistofemployee] = useState([])
  const getemployees = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/employee')
      const data = await response.data
      setlistofemployee(data)
    } catch (error) {
      console.log(error)
    }
  }

  const [employeeid, setemployeeid] = useState("")
  const [fullname, setfullname] = useState("")
  const [numberID, setnumberID] = useState("")
  const [username, setusername] = useState("")
  const [basicSalary, setbasicSalary] = useState()
  const [payRoll, setpayRoll] = useState([])
  const [password, setpassword] = useState("")
  const [address, setaddress] = useState("")
  const [phone, setphone] = useState("")
  const [email, setemail] = useState("")
  const [isAdmin, setisAdmin] = useState(true)
  const [isActive, setisActive] = useState(true)
  const [role, setrole] = useState("")

  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, // Close after 3 seconds
    });
  };

  const createEmployeeSchema = Joi.object({
    fullname: Joi.string().min(3).max(100),
    numberID: Joi.string().length(14),
    username: Joi.string().min(3).max(100),
    email: Joi.string().email(),
    address: Joi.string().min(3).max(150),
    phone: Joi.string().length(11),
    password: Joi.string().min(3),
    basicSalary: Joi.number().min(0),
    role: Joi.string().valid('manager', 'casher', 'waiter', 'Chef'),
    isActive: Joi.boolean(),
});
  const createEmployee = async (e) => {
    e.preventDefault()
    const { error } = createEmployeeSchema.validate({ fullname, numberID, username, email, address, phone, password, basicSalary, role, isActive });
    if (error) {
        notify(error.details[0].message, 'error');
        return;
    }
    if (
      !fullname ||
      !basicSalary ||
      !numberID ||
      !username ||
      !password ||
      !address ||
      !phone ||
      !email ||
      !isActive ||
      !role
    ) {
      // Notify the user that some fields are missing
      notify('Please fill in all required fields', 'error');
      return;
    }
    try {
      const newemployee = await axios.post('https://caviar-api.vercel.app/api/employee', { fullname, basicSalary, numberID, payRoll, username, password, address, phone, email, isActive, role })
      console.log(newemployee)
      notify('Employee created successfully', 'success');
      getemployees();
    } catch (error) {
      console.log(error);
      notify('Failed to create employee', 'error');
    }
  };


  const updateEmployeeSchema = Joi.object({
    fullname: Joi.string().min(3).max(100),
    numberID: Joi.string().length(14),
    username: Joi.string().min(3).max(100),
    email: Joi.string().email(),
    address: Joi.string().min(3).max(150),
    phone: Joi.string().length(11),
    password: Joi.string().min(3),
    basicSalary: Joi.number().min(0),
    role: Joi.string().valid('manager', 'casher', 'waiter', 'Chef'),
    isActive: Joi.boolean(),
});
  const editEmployee = async (e) => {
    e.preventDefault()
    console.log(fullname)
    console.log(username)
    console.log(password)
    console.log(address)
    console.log(phone)
    console.log(email)
    console.log(isActive)
    console.log(role)
    console.log(basicSalary)
    try {
      const { error } = updateEmployeeSchema.validate({ fullname, numberID, username, email, address, phone, password, basicSalary, role, isActive });
      if (error) {
          notify(error.details[0].message, 'error');
          return;
      }

      const updateData = password
          ? { fullname, numberID, username, email, address, phone, password: hashedPassword, basicSalary, isActive, role }
          : { fullname, numberID, username, email, address, phone, basicSalary, isActive, role };

      const update = await axios.put(`https://caviar-api.vercel.app/api/employee/${employeeid}`, updateData);
      if (update.status === 200){
      getemployees()
      notify('Employee details updated', 'success');
      // Additional logic if needed after successful update
    }

  } catch (error) {
      notify('Failed to update employee details', 'error');
      console.log(error);
      // Additional error handling
  }
};


    const [filterEmp, setfilterEmp] = useState([])
    const getemployeesByJob = (role) => {
      if (listofemployee.length > 0) {
        const FilterEmployees = listofemployee.filter(employee => employee.role == role)
        setfilterEmp(FilterEmployees)
      }
    }
    const filterEmpByStatus = (status) => {
      console.log(status);
      let filteredEmployees;

      if (status === 'true') {
        filteredEmployees = listofemployee.filter((employee) => employee.isActive === true);
      } else if (status === 'false') {
        filteredEmployees = listofemployee.filter((employee) => employee.isActive === false);
      } else {
        filteredEmployees = listofemployee; // If status is not 'true' or 'false', show all employees
      }

      console.log(filteredEmployees);
      setfilterEmp(filteredEmployees);
    };

    const deleteEmployee = async (e) => {
      e.preventDefault();
      try {
        const deleted = await axios.delete(`https://caviar-api.vercel.app/api/employee/${employeeid}`);
        notify('Employee deleted', 'success');
        getemployees();
      } catch (error) {
        console.log(error);
        notify('Failed to delete employee', 'error');
      }
    };


    useEffect(() => {
      getemployees()
    }, [])
    return (
      <detacontext.Consumer>
        {
          ({ EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
            return (
              <div className="container-xl mlr-auto">
                <div className="table-responsive">
                  <div className="table-wrapper">
                    <div className="table-title">
                      <div className="row">
                        <div className="col-sm-6">
                          <h2>ادارة <b>الموظفين</b></h2>
                        </div>
                        <div className="col-sm-6 d-flex justify-content-end">
                          <a href="#addEmployeeModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافة موظف جديد</span></a>
                          <a href="#deleteEmployeeModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف الكل</span></a>
                        </div>
                      </div>
                    </div>
                    <div class="table-filter">
                      <div class="row text-dark">
                        <div class="col-sm-3">
                          <div class="show-entries">
                            <span>عرض</span>
                            <select class="form-control" onChange={(e) => { setstartpagination(0); setendpagination(e.target.value) }}>
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                              <option value={15}>15</option>
                              <option value={20}>20</option>
                              <option value={25}>25</option>
                              <option value={30}>30</option>
                            </select>
                            <span>عنصر</span>
                          </div>
                        </div>
                        <div class="col-sm-9">
                          <div class="filter-group">
                            <label>Name</label>
                            <input type="text" class="form-control" />
                            <button type="button" class="btn btn-primary"><i class="fa fa-search"></i></button>
                          </div>
                          <div class="filter-group">
                            <label>الوظيفة</label>
                            <select class="form-control" onChange={(e) => getemployeesByJob(e.target.value)} >
                              <option>الكل</option>
                              <option value="manager">مدير</option>
                              <option value="casher">كاشير</option>
                              <option value="waiter">ويتر</option>
                              <option value="Chef">شيف</option>
                            </select>
                          </div>
                          <div class="filter-group">
                            <label>الحالة</label>
                            <select class="form-control" onChange={(e) => filterEmpByStatus(e.target.value)} >
                              <option >الكل</option>
                              <option value={true}>متاح</option>
                              <option value={false}>غير متاح</option>
                            </select>
                          </div>
                          {/* <span class="filter-icon"><i class="fa fa-filter"></i></span> */}
                        </div>
                      </div>
                    </div>
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>
                            <span className="custom-checkbox">
                              <input type="checkbox" id="selectAll" />
                              <label htmlFor="selectAll"></label>
                            </span>
                          </th>
                          <th>م</th>
                          <th>الاسم</th>
                          <th>رقم قومي</th>
                          <th>العنوان</th>
                          <th>الموبايل</th>
                          <th>الوظيفه</th>
                          <th>الراتب</th>
                          <th>الحالة</th>
                          <th>اجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filterEmp.length > 0 ? filterEmp.map((emp, i) => {
                          if (i >= startpagination & i < endpagination) {
                            return (
                              <tr key={i}>
                                <td>
                                  <span className="custom-checkbox">
                                    <input type="checkbox" id="checkbox1" name="options[]" value="1" />
                                    <label htmlFor="checkbox1"></label>
                                  </span>
                                </td>
                                <td>{i + 1}</td>
                                <td>{emp.fullname}</td>
                                <td>{emp.numberID}</td>
                                <td>{emp.address}</td>
                                <td>{emp.phone}</td>
                                <td>{emp.role}</td>
                                <td>{emp.basicSalary}</td>
                                <td>{emp.isActive ? 'متاح' : "غير متاح"}</td>
                                <td>
                                  <a href="#editEmployeeModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit" onClick={() => {
                                    setemployeeid(emp._id); setnumberID(emp.numberID); setusername(emp.username); setaddress(emp.address); setemail(emp.email); setisAdmin(emp.isAdmin); setisActive(emp.isActive); setphone(emp.phone); setrole(emp.role); setbasicSalary(emp.basicSalary)
                                  }}>&#xE254;</i></a>
                                  <a href="#deleteEmployeeModal" className="delete" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Delete" onClick={() => setemployeeid(emp._id)}>&#xE872;</i></a>
                                </td>
                              </tr>
                            )
                          }
                        })
                          : listofemployee.map((emp, i) => {
                            // if (i < pagination & i >= pagination - 5) {
                            if (i >= startpagination & i < endpagination) {
                              return (
                                <tr key={i}>
                                  <td>
                                    <span className="custom-checkbox">
                                      <input type="checkbox" id="checkbox1" name="options[]" value="1" />
                                      <label htmlFor="checkbox1"></label>
                                    </span>
                                  </td>
                                  <td>{i + 1}</td>
                                  <td>{emp.fullname}</td>
                                  <td>{emp.numberID}</td>
                                  <td>{emp.address}</td>
                                  <td>{emp.phone}</td>
                                  <td>{emp.role}</td>
                                  <td>{emp.basicSalary}</td>
                                  <td>{emp.isActive ? 'متاح' : "غير متاح"}</td>
                                  <td>
                                    <a href="#editEmployeeModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit" onClick={() => {
                                      setemployeeid(emp._id); setfullname(emp.fullname); setnumberID(emp.numberID); setusername(emp.username); setaddress(emp.address); setemail(emp.email); setisAdmin(emp.isAdmin); setisActive(emp.isActive); setphone(emp.phone); setrole(emp.role); setbasicSalary(emp.basicSalary)
                                    }}>&#xE254;</i></a>
                                    <a href="#deleteEmployeeModal" className="delete" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Delete" onClick={() => setemployeeid(emp._id)}>&#xE872;</i></a>
                                  </td>
                                </tr>
                              )
                            }
                          })
                        }
                      </tbody>
                    </table>
                    <div className="clearfix">
                      <div className="hint-text text-dark">عرض <b>{listofemployee.length > endpagination ? endpagination : listofemployee.length}</b> من <b>{listofemployee.length}</b> عنصر</div>
                      <ul className="pagination">
                        <li onClick={EditPagination} className="page-item disabled"><a href="#">السابق</a></li>
                        <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">1</a></li>
                        <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">2</a></li>
                        <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">3</a></li>
                        <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">4</a></li>
                        <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">5</a></li>
                        <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">التالي</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div id="addEmployeeModal" className="modal fade">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <form onSubmit={createEmployee}>
                        <div className="modal-header">
                          <h4 className="modal-title">اضافه موظف</h4>
                          <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        </div>
                        <div className="modal-body">
                          <div className="form-group">
                            <label>الاسم</label>
                            <input type="text" className="form-control" required pattern="[A-Za-z\s]+" onChange={(e) => setfullname(e.target.value)} />
                            <div className="invalid-feedback">Please enter a valid name.</div>
                          </div>
                          <div className="form-group">
                            <label>اسم المستخدم</label>
                            <input type="text" className="form-control" required onChange={(e) => setusername(e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label>الموبايل</label>
                            <input type="text" className="form-control" required pattern="[0-9]{11}" onChange={(e) => setphone(e.target.value)} />
                            <div className="invalid-feedback">Please enter a valid phone number (11 digits).</div>
                          </div>
                          <div className="form-group">
                            <label>الباسورد</label>
                            <input type="text" className="form-control" required onChange={(e) => setpassword(e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label>الرقم القومي</label>
                            <input type="text" className="form-control" required onChange={(e) => setnumberID(e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label>الايميل</label>
                            <input type="email" className="form-control" required onChange={(e) => setemail(e.target.value)} />
                            <div className="invalid-feedback">Please enter a valid email address.</div>
                          </div>
                          <div className="form-group">
                            <label>العنوان</label>
                            <textarea className="form-control" required onChange={(e) => setaddress(e.target.value)}></textarea>
                          </div>
                          <div className="form-group">
                            <label>الحالة</label>
                            <select form="carform" required onChange={(e) => setisActive(e.target.value)}>
                              <option >اختر</option>
                              <option value={true}>متاح</option>
                              <option value={false}>ليس متاح</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>الوظيفه</label>
                            <select name={role} form="carform" required onChange={(e) => setrole(e.target.value)}>
                              <option>اختار وظيفة</option>
                              <option value="manager">مدير</option>
                              <option value="casher">كاشير</option>
                              <option value="waiter">ويتر</option>
                              <option value="Chef">شيف</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>المرتب الاساسي</label>
                            <input type="Number" min={0} className="form-control" required onChange={(e) => setbasicSalary(e.target.value)} />
                            <div className="invalid-feedback">Please enter a valid salary.</div>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <input type="button" className="btn btn-danger" data-dismiss="modal" value="اغلاق" />
                          <input type="submit" className="btn btn-success" value="اضافه" />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div id="editEmployeeModal" className="modal fade">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <form onSubmit={editEmployee}>
                        <div className="modal-header">
                          <h4 className="modal-title">تعديل بيانات الموظفين</h4>
                          <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        </div>
                        <div className="modal-body">
                          <div className="form-group">
                            <label>الاسم</label>
                            <input type="text" className="form-control" defaultValue={fullname} required pattern="[A-Za-z\s]+" onChange={(e) => setfullname(e.target.value)} />
                            <div className="invalid-feedback">الرجاء إدخال اسم صحيح.</div>
                          </div>
                          <div className="form-group">
                            <label>اسم المستخدم</label>
                            <input type="text" className="form-control" defaultValue={username} required onChange={(e) => setusername(e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label>الموبايل</label>
                            <input type="text" className="form-control" defaultValue={phone} required pattern="[0-9]{11}" onChange={(e) => setphone(e.target.value)} />
                            <div className="invalid-feedback">الرجاء إدخال رقم هاتف صحيح (11 رقم).</div>
                          </div>
                          <div className="form-group">
                            <label>الباسورد</label>
                            <input type="password" className="form-control" onChange={(e) => setpassword(e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label>الرقم القومي</label>
                            <input type="text" className="form-control" defaultValue={numberID} required onChange={(e) => setnumberID(e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label>الايميل</label>
                            <input type="email" className="form-control" defaultValue={email} required onChange={(e) => setemail(e.target.value)} />
                            <div className="invalid-feedback">الرجاء إدخال عنوان بريد إلكتروني صحيح.</div>
                          </div>
                          <div className="form-group">
                            <label>العنوان</label>
                            <textarea className="form-control" defaultValue={address} required onChange={(e) => setaddress(e.target.value)}></textarea>
                          </div>
                          <div className="form-group">
                            <label>الحالة</label>
                            <select form="carform" required defaultValue={isActive} onChange={(e) => setisActive(e.target.value)}>
                              <option>اختر</option>
                              <option value={true}>متاح</option>
                              <option value={false}>ليس متاح</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>الوظيفة</label>
                            <select name={role} form="carform" defaultValue={role} required onChange={(e) => setrole(e.target.value)}>
                              <option>اختار وظيفة</option>
                              <option value="manager">مدير</option>
                              <option value="casher">كاشير</option>
                              <option value="waiter">ويتر</option>
                              <option value="Chef">شيف</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>المرتب الاساسي</label>
                            <input type="Number" min={0} className="form-control" defaultValue={basicSalary} required onChange={(e) => setbasicSalary(e.target.value)} />
                          </div>
                        </div>
                        <div className="modal-footer">
                          <input type="button" className="btn btn-danger" data-dismiss="modal" value="اغلاق" />
                          <input type="submit" className="btn btn-info" value="حفظ" />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div id="deleteEmployeeModal" className="modal fade">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <form onSubmit={deleteEmployee}>
                        <div className="modal-header">
                          <h4 className="modal-title">حذف موظف</h4>
                          <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        </div>
                        <div className="modal-body">
                          <p>هل انت متاكد من حذف هذا السجل؟?</p>
                          <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                        </div>
                        <div className="modal-footer">
                          <input type="button" className="btn btn-danger" data-dismiss="modal" value="اغلاق" />
                          <input type="submit" className="btn btn-danger" value="حذف" />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        }
      </detacontext.Consumer>
    )
  }

  export default Employees