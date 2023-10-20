import React, { useState, useEffect } from 'react'
import axios from 'axios'


const Employees = () => {
  // const [pagination, setpagination] = useState(0)
  // const EditPagination = (e) => {
  //   if (e.target.innerHTML == 'Next') {
  //     setpagination(pagination + 5)
  //   } else if (e.target.innerHTML == 'Previous') {
  //     if (pagination <= 5) {
  //       setpagination(5)
  //     } else {
  //       setpagination(pagination - 5)
  //     }
  //   } else {
  //     setpagination(e.target.innerHTML * 5)
  //   }
  // }
  const [startpagination, setstartpagination] = useState(0)
  const [endpagination, setendpagination] = useState(5)
  const EditPagination = (e) => {
    if (e.target.innerHTML == 'Next') {
      setstartpagination(startpagination + 5)
      setendpagination(endpagination + 5)
    } else if (e.target.innerHTML == 'Previous') {
      if (endpagination <= 5) {
        setstartpagination(0)
        setendpagination(5)
      } else {
        setstartpagination(startpagination - 5)
        setendpagination(endpagination - 5)
      }
    } else {
      setstartpagination((e.target.innerHTML * 5) - 5)
      setendpagination(e.target.innerHTML * 5)

    }
  }

  const [listofemployee, setlistofemployee] = useState([])
  const getemployees = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/user')
      const data = await response.data
      const employee = data.filter((em) => em.isAdmin == true)
      setlistofemployee(employee)
    } catch (error) {
      console.log(error)
    }
  }

  const [userid, setuserid] = useState("")
  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")
  const [address, setaddress] = useState("")
  const [phone, setphone] = useState("")
  const [email, setemail] = useState("")
  const [isAdmin, setisAdmin] = useState(true)
  const [isActive, setisActive] = useState(true)
  const [role, setrole] = useState("")
  const [salary, setsalary] = useState()


  const createEmployee = async (e) => {
    e.preventDefault()
    console.log(username)
    console.log(password)
    console.log(address)
    console.log(phone)
    console.log(email)
    console.log(isAdmin)
    console.log(role)
    console.log(salary)

    try {
      const newemployee = await axios.post('https://caviar-api.vercel.app/api/user', { username, password, address, phone, email, isAdmin, role, salary })
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
    console.log(userid)
    console.log(username)
    console.log(password)
    console.log(address)
    console.log(phone)
    console.log(email)
    console.log(isAdmin)
    console.log(isActive)
    console.log(role)
    console.log(salary)
    try {
      if (password) {
        const update = await axios.put(`https://caviar-api.vercel.app/api/user/${userid}`, { username, password, address, phone, email, isAdmin, isActive, role, salary })
        console.log(update)
        if (update) {
          getemployees()
        }
      } else {
        const update = await axios.put(`https://caviar-api.vercel.app/api/user/${userid}`, { username, address, phone, email, isAdmin, isActive, role, salary })
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
      const FilterEmployees = listofemployee.filter(employee => employee.role == role)
      setfilterEmp(FilterEmployees)
    }
  }
  const filterEmpByStatus= (status) => {
    console.log(status)
    if (listofemployee.length > 0) {
      console.log(listofemployee)
      const filteredEmployees = listofemployee.filter(employee => employee.isActive == status)
      console.log(filteredEmployees)
      setfilterEmp(filteredEmployees)
    }
  }

  const deleteEmployee = async (e) => {
    e.preventDefault()
    try {
      console.log(userid)
      const deleted = await axios.delete(`https://caviar-api.vercel.app/api/user/${userid}`)
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
                  <span>صفوف</span>
                </div>
              </div>
              <div class="col-sm-9">
                <button type="button" class="btn btn-primary"><i class="fa fa-search"></i></button>
                <div class="filter-group">
                  <label>Name</label>
                  <input type="text" class="form-control" />
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
                  <select class="form-control" onChange={(e) = filterEmpByStatus(e.target.value)} >
                    <option >الكل</option>
                    <option value="true">متاح</option>
                    <option value="false">غير متاح</option>
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
                <th>العنوان</th>
                <th>الموبايل</th>
                <th>الراتب</th>
                <th>الوظيفه</th>
                <th>الحالة</th>
                <th>اجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filterEmp.length > 0 ? filterEmp.map((e, i) => {
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
                      <td>{e.username}</td>
                      <td>{e.address}</td>
                      <td>{e.phone}</td>
                      <td>{e.salary}</td>
                      <td>{e.role}</td>
                      <td>{e.isActive ? 'متاح' : "غير متاح"}</td>
                      <td>
                        <a href="#editEmployeeModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit" onClick={() => {
                          setuserid(e._id); setusername(e.username); setaddress(e.address); setemail(e.email); setisAdmin(e.isAdmin); setisActive(e.isActive); setphone(e.phone); setrole(e.role); setsalary(e.salary)
                        }}>&#xE254;</i></a>
                        <a href="#deleteEmployeeModal" className="delete" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Delete" onClick={() => setuserid(e._id)}>&#xE872;</i></a>
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
                        <td>{e.username}</td>
                        <td>{e.address}</td>
                        <td>{e.phone}</td>
                        <td>{e.salary}</td>
                        <td>{e.role}</td>
                        <td>{e.isActive ? 'متاح' : "غير متاح"}</td>
                        <td>
                          <a href="#editEmployeeModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit" onClick={() => {
                            setuserid(e._id); setusername(e.username); setaddress(e.address); setemail(e.email); setisAdmin(e.isAdmin); setisActive(e.isActive); setphone(e.phone); setrole(e.role); setsalary(e.salary)
                          }}>&#xE254;</i></a>
                          <a href="#deleteEmployeeModal" className="delete" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Delete" onClick={() => setuserid(e._id)}>&#xE872;</i></a>
                        </td>
                      </tr>
                    )
                  }
                })
              }
            </tbody>
          </table>
          <div className="clearfix">
            <div className="hint-text">Showing <b>{listofemployee.length > endpagination ? endpagination : listofemployee.length}</b> out of <b>{listofemployee.length}</b> entries</div>
            <ul className="pagination">
              <li onClick={EditPagination} className="page-item disabled"><a href="#">Previous</a></li>
              <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">1</a></li>
              <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">2</a></li>
              <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">3</a></li>
              <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">4</a></li>
              <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">5</a></li>
              <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">Next</a></li>
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
                  <input type="text" className="form-control" required onChange={(e) => setusername(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>الموبايل</label>
                  <input type="text" className="form-control" required onChange={(e) => setphone(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>الباسورد</label>
                  <input type="text" className="form-control" required onChange={(e) => setpassword(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>الايميل</label>
                  <input type="email" className="form-control" required onChange={(e) => setemail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>العنوان</label>
                  <textarea className="form-control" required onChange={(e) => setaddress(e.target.value)}></textarea>
                </div>
                <div className="form-group">
                  <label>ادمن</label>
                  <select form="carform" required onChange={(e) => setisAdmin(e.target.value)}>
                    <option value={true}>ادمن</option>
                    <option value={false}>ليس ادمن</option>
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
                  <label>المرتب</label>
                  <input type="Number" min={0} className="form-control" required onChange={(e) => setsalary(e.target.value)} />
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
                  <input type="text" className="form-control" required defaultValue={username} onChange={(e) => setusername(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>الموبايل</label>
                  <input type="text" className="form-control" required defaultValue={phone} onChange={(e) => setphone(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>الباسورد</label>
                  <input type="text" className="form-control" onChange={(e) => setpassword(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>الايميل</label>
                  <input type="email" className="form-control" required defaultValue={email} onChange={(e) => setemail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>العنوان</label>
                  <textarea className="form-control" required defaultValue={address} onChange={(e) => setaddress(e.target.value)}></textarea>
                </div>
                <div className="form-group">
                  <label>ادمن</label>
                  <select form="carform" required defaultValue={isAdmin} onChange={(e) => setisAdmin(e.target.value)}>
                    <option value={true}>ادمن</option>
                    <option value={false}>ليس ادمن</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>الحالة</label>
                  <select form="carform" required defaultValue={isActive} onChange={(e) => setisActive(e.target.value)}>
                    <option value={true}>متاح</option>
                    <option value={false}>ليس متاح</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>الوظيفه</label>
                  <select form="carform" required defaultValue={role} onChange={(e) => setrole(e.target.value)}>
                    <option>اختار وظيفة</option>
                    <option value="manager">مدير</option>
                    <option value="casher">كاشير</option>
                    <option value="waiter">ويتر</option>
                    <option value="Chef">شيف</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>المرتب</label>
                  <input type="Number" min={0} className="form-control" required defaultValue={salary} onChange={(e) => setsalary(e.target.value)} />
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

export default Employees