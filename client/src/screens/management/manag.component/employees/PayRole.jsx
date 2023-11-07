import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';


const PayRole = () => {

  const [listofemployee, setlistofemployee] = useState([])
  const getemployees = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/employee')
      const data = await response.data
      const employee = data.filter((em) => em.isActive == true)
      setlistofemployee(employee)
    } catch (error) {
      console.log(error)
    }
  }

  const [employeeid, setemployeeid] = useState("")
  const [Month, setMonth] = useState()
  const [salary, setsalary] = useState()
  const [Additional, setAdditional] = useState()
  const [Bonus, setBonus] = useState()
  const [TotalDue, setTotalDue] = useState()
  const [Absence, setAbsence] = useState()
  const [Deduction, setDeduction] = useState()
  const [Predecessor, setPredecessor] = useState()
  const [Insurance, setInsurance] = useState()
  const [Tax, setTax] = useState()
  const [TotalDeductible, setTotalDeductible] = useState()
  const [NetSalary, setNetSalary] = useState()

  const [listofsalarymovement, setlistofsalarymovement] = useState([])
  const getSalaryMovement = async () => {
    const movement = await axios.get('https://caviar-api.vercel.app/api/salarymovement')
    console.log(movement)
    setlistofsalarymovement(movement.data)
  }

  const movementArray = ['سلف', 'خصم', 'غياب', 'اضافي', 'مكافأة']
  const addPayRoll = () => {
    for (let i = 0; i < listofemployee.length; i++) {
      // console.log(listofsalarymovement)
      // console.log(listofemployee)
      // console.log(listofemployee[i]._id)
      let id = listofemployee[i]._id
      // console.log(id)
      const employeemov = listofsalarymovement.length > 0 ? listofsalarymovement.filter((m) => m.EmployeeId == id):'';
      console.log(employeemov)
      if(employeemov.length>0){

      const filterPre = employeemov.filter((m) => m.movement == 'سلف')
      console.log(filterPre)
      if (filterPre.length>0){
        setPredecessor(filterPre[filterPre.length-1].newAmount)
        console.log(filterPre[filterPre.length-1].newAmount)
      }else{setPredecessor(0)}
      
      const filterDed = employeemov.filter((m) => m.movement == 'خصم')
      console.log(filterDed)
      if (filterDed.length>0){
        setDeduction(filterDed[filterDed.length-1].newAmount)
        console.log(filterDed[filterDed.length-1].newAmount)
      }else{setDeduction(0)}
      
      const filterAbs = employeemov.filter((m) => m.movement == 'غياب')
      if (filterAbs.length>0){
        setAbsence(filterAbs[filterAbs.length-1].newAmount)
        console.log(filterAbs[filterAbs.length-1].newAmount)
      }else{setAbsence(0)}
      
      const filterAdd = employeemov.filter((m) => m.movement == 'اضافي')
      if (filterAdd.length>0){
        setAdditional(filterAdd[filterAdd.length-1].newAmount)
        console.log(filterAdd[filterAdd.length-1].newAmount)
      }else{setAdditional(0)}

      const filterBon = employeemov.filter((m) => m.movement == 'مكافأة')
      if (filterBon.length>0){
        setBonus(filterBon[filterBon.length-1].newAmount)
        console.log(filterBon[filterBon.length-1].newAmount)
      }else{setBonus(0)}
      
    }
    cons()
  }
}

  const cons = ()=>{
    console.log(Absence)
    console.log(Additional)
    console.log(Bonus)
    console.log(Predecessor)
    console.log(Deduction)
  }

  const [filterEmp, setfilterEmp] = useState([])
  const getemployeesByJob = (role) => {
    if (listofemployee.length > 0) {
      const FilterEmployees = listofemployee.filter(employee => employee.role == role)
      setfilterEmp(FilterEmployees)
    }
  }
  const filterEmpByStatus = (status) => {
    console.log(status)
    if (status == true) {
      console.log(listofemployee)
      const filteredEmployees = listofemployee.filter(employee => employee.isActive == true)
      console.log(filteredEmployees)
      setfilterEmp(filteredEmployees)
    } else if (status == false) {
      const filteredEmployees = listofemployee.filter(employee => employee.isActive == false)
      console.log(filteredEmployees)
      setfilterEmp(filteredEmployees)
    }
  }

  // const deleteEmployee = async (e) => {
  //   e.preventDefault()
  //   try {
  //     console.log(userid)
  //     const deleted = await axios.delete(`https://caviar-api.vercel.app/api/user/${userid}`)
  //     console.log(deleted)
  //     getemployees()
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }


  useEffect(() => {
    getemployees()
    getSalaryMovement()
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
                        <h2>ادارة <b>الرواتب</b></h2>
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
                          <label>الحركة</label>
                          <select class="form-control" >
                            <option>الكل</option>
                            <option value="manager">مدير</option>
                            <option value="casher">كاشير</option>
                            <option value="waiter">ويتر</option>
                            <option value="Chef">شيف</option>
                          </select>
                        </div>
                        <div class="filter-group">
                          <label>الحالة</label>
                          <select class="form-control" >
                            <option >الكل</option>
                            <option value={true}>متاح</option>
                            <option value={false}>غير متاح</option>
                          </select>
                        </div>
                        <div class="filter-group">
                          <input type="button" value="add" onClick={addPayRoll} />
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
                        <th>الاساسي</th>
                        <th>اجر اليوم</th>
                        <th>اجر الساعه</th>
                        <th>عدد ايام العمل</th>
                        <th>اضافي</th>
                        <th>مكافاة</th>
                        <th>اجمالي المستحق</th>
                        <th>عدد ايام الغياب</th>
                        <th>خصم</th>
                        <th>غياب</th>
                        <th>سلف</th>
                        <th>تامين</th>
                        <th>ضريبه</th>
                        <th>اجمالي المستقطع</th>
                        <th>المستحق عن الشهر</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {
                      filterEmp.length > 0 ? filterEmp.map((e, i) => {
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
                          listofsalarymovement.filter(s=>s.EmployeeId==e._id).map((sal,i)=>{

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
                        })
                      } */}
                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{listofemployee.length > endpagination ? endpagination : listofemployee.length}</b> out of <b>{listofemployee.length}</b> entries</div>
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
              {/* <div id="addEmployeeModal" className="modal fade">
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
              </div> */}
            </div>
          )
        }
      }
    </detacontext.Consumer>
  )
}

export default PayRole