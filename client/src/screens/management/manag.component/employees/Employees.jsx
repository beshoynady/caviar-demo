import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';


const Employees = () => {

  const [listofemployee, setlistofemployee] = useState([])
  const getemployees = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/employee')
      const data = await response.data
      const employee = data.filter((em) => em.isAdmin == true)
      setlistofemployee(employee)
    } catch (error) {
      console.log(error)
    }
  }

  const [employeeid, setemployeeid] = useState("")
  const [fullname, setfullname] = useState("")
  const [numberID, setnumberID] = useState("")
  const [username, setusername] = useState("")
  const [basicSalary, setbasicSalary] = useState()
  const [payRole, setpayRole] = useState([])
  const [password, setpassword] = useState("")
  const [address, setaddress] = useState("")
  const [phone, setphone] = useState("")
  const [email, setemail] = useState("")
  const [isAdmin, setisAdmin] = useState(true)
  const [isActive, setisActive] = useState(true)
  const [role, setrole] = useState("")


  const createEmployee = async (e) => {
    e.preventDefault()
    console.log(username)
    console.log(password)
    console.log(address)
    console.log(phone)
    console.log(email)
    console.log(isAdmin)
    console.log(role)
    console.log(basicSalary)

    try {
      const newemployee = await axios.post('https://caviar-api.vercel.app/api/employee', {fullname, basicSalary, numberID, payRole, username, password, address, phone, email, isAdmin, role })
      console.log(newemployee)
      if (newemployee) {
        getemployees()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const updateEmployee = async (e) => {
    e.preventDefault()
    console.log(employeeid)
    console.log(username)
    console.log(password)
    console.log(address)
    console.log(phone)
    console.log(email)
    console.log(isAdmin)
    console.log(isActive)
    console.log(role)
    console.log(basicSalary)
    try {
      if (password) {
        const update = await axios.put(`https://caviar-api.vercel.app/api/employee/${employeeid}`, {fullname, basicSalary, numberID, payRole, username, address, phone, email, isAdmin, role })
        console.log(update)
        if (update) {
          getemployees()
        }
      } else {
        const update = await axios.put(`https://caviar-api.vercel.app/api/employee/${employeeid}`, {fullname, basicSalary, numberID, payRole, username, password, address, phone, email, isAdmin, role})
        console.log(update)
        if (update) {
          getemployees()
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const [filterEmp, setfilterEmp] = useState([])
  const getemployeesByJob = (role) => {
    if (listofemployee.length > 0) {
      const FilterEmployees = listofemployee.filter(employee => employeemp.role == role)
      setfilterEmp(FilterEmployees)
    }
  }
  const filterEmpByStatus = (status) => {
    console.log(status)
    // if (status == true) {
    //   console.log(listofemployee)
      const filteredEmployees = listofemployee.filter(employee => employeemp.isActive == true)
      console.log(filteredEmployees)
      setfilterEmp(filteredEmployees)
    // } else if (status == false) {
    //   const filteredEmployees = listofemployee.filter(employee => employeemp.isActive == false)
    //   console.log(filteredEmployees)
    //   setfilterEmp(filteredEmployees)
    // }
  }

  const deleteEmployee = async (e) => {
    e.preventDefault()
    try {
      console.log(employeeid)
      const deleted = await axios.delete(`https://caviar-api.vercel.app/api/employee/${employeeid}`)
      console.log(deleted)
      getemployees()
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    getemployees()
  }, [])
  return (
    <detacontext.Consumer>
      {
        ({ EditPagination, startpagination, endpagination, setstartpagination, setendpagination}) => {
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
                          <select class="form-control" onChange={(e) => { setstartpagination(0); setendpagination(emp.target.value) }}>
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
                          <select class="form-control" onChange={(e) => getemployeesByJob(emp.target.value)} >
                            <option>الكل</option>
                            <option value="manager">مدير</option>
                            <option value="casher">كاشير</option>
                            <option value="waiter">ويتر</option>
                            <option value="Chef">شيف</option>
                          </select>
                        </div>
                        <div class="filter-group">
                          <label>الحالة</label>
                          <select class="form-control" onChange={(e) => filterEmpByStatus(emp.target.value)} >
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
                              <td>{emp.username}</td>
                              <td>{emp.numberID}</td>
                              <td>{emp.address}</td>
                              <td>{emp.phone}</td>
                              <td>{emp.role}</td>
                              <td>{emp.basicSalary}</td>
                              <td>{emp.isActive ? 'متاح' : "غير متاح"}</td>
                              <td>
                                <a href="#editEmployeeModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit" onClick={() => {
                                  setemployeeid(emp._id);setnumberID(emp.numberID); setusername(emp.username); setaddress(emp.address); setemail(emp.email); setisAdmin(emp.isAdmin); setisActive(emp.isActive); setphone(emp.phone); setrole(emp.role); setbasicSalary(emp.basicSalary)
                                }}>&#xE254;</i></a>
                                <a href="#deleteEmployeeModal" className="delete" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Delete" onClick={() => setemployeeid(emp._id)}>&#xE872;</i></a>
                              </td>
                            </tr>
                          )
                        }
                      })
                        : listofemployee.map((e, i) => {
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
                                <td>{emp.username}</td>
                                <td>{emp.numberID}</td>
                                <td>{emp.address}</td>
                                <td>{emp.phone}</td>
                                <td>{emp.role}</td>
                                <td>{emp.basicSalary}</td>
                                <td>{emp.isActive ? 'متاح' : "غير متاح"}</td>
                                <td>
                                  <a href="#editEmployeeModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit" onClick={() => {
                                    setemployeeid(emp._id);setnumberID(emp.numberID); setusername(emp.username); setaddress(emp.address); setemail(emp.email); setisAdmin(emp.isAdmin); setisActive(emp.isActive); setphone(emp.phone); setrole(emp.role); setbasicSalary(emp.basicSalary)
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
                          <input type="text" className="form-control" required onChange={(e) => setusername(emp.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الرقم القومي</label>
                          <input type="text" className="form-control" required onChange={(e) => setnumberID(emp.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الموبايل</label>
                          <input type="text" className="form-control" required onChange={(e) => setphone(emp.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الباسورد</label>
                          <input type="text" className="form-control" required onChange={(e) => setpassword(emp.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الايميل</label>
                          <input type="email" className="form-control" required onChange={(e) => setemail(emp.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>العنوان</label>
                          <textarea className="form-control" required onChange={(e) => setaddress(emp.target.value)}></textarea>
                        </div>
                        <div className="form-group">
                          <label>ادمن</label>
                          <select form="carform" required onChange={(e) => setisAdmin(emp.target.value)}>
                            <option value={true}>ادمن</option>
                            <option value={false}>ليس ادمن</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>الوظيفه</label>
                          <select name={role} form="carform" required onChange={(e) => setrole(emp.target.value)}>
                            <option>اختار وظيفة</option>
                            <option value="manager">مدير</option>
                            <option value="casher">كاشير</option>
                            <option value="waiter">ويتر</option>
                            <option value="Chef">شيف</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>المرتب الاساسي</label>
                          <input type="Number" min={0} className="form-control" required onChange={(e) => setbasicSalary(emp.target.value)} />
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
                    <form onSubmit={updateEmployee}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل بيانات الموظفين</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>الاسم</label>
                          <input type="text" className="form-control" required defaultValue={username} onChange={(e) => setusername(emp.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الرقم القومي</label>
                          <input type="text" className="form-control" required defaultValue={numberID} onChange={(e) => setnumberID(emp.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الموبايل</label>
                          <input type="text" className="form-control" required defaultValue={phone} onChange={(e) => setphone(emp.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الباسورد</label>
                          <input type="text" className="form-control" onChange={(e) => setpassword(emp.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الايميل</label>
                          <input type="email" className="form-control" required defaultValue={email} onChange={(e) => setemail(emp.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>العنوان</label>
                          <textarea className="form-control" required defaultValue={address} onChange={(e) => setaddress(emp.target.value)}></textarea>
                        </div>
                        <div className="form-group">
                          <label>ادمن</label>
                          <select form="carform" required defaultValue={isAdmin} onChange={(e) => setisAdmin(emp.target.value)}>
                            <option value={true}>ادمن</option>
                            <option value={false}>ليس ادمن</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>الحالة</label>
                          <select form="carform" required defaultValue={isActive} onChange={(e) => setisActive(emp.target.value)}>
                            <option value={true}>متاح</option>
                            <option value={false}>ليس متاح</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>الوظيفه</label>
                          <select form="carform" required defaultValue={role} onChange={(e) => setrole(emp.target.value)}>
                            <option>اختار وظيفة</option>
                            <option value="manager">مدير</option>
                            <option value="casher">كاشير</option>
                            <option value="waiter">ويتر</option>
                            <option value="Chef">شيف</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>المرتب الاساسي</label>
                          <input type="Number" min={0} className="form-control" required defaultValue={basicSalary} onChange={(e) => setbasicSalary(emp.target.value)} />
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