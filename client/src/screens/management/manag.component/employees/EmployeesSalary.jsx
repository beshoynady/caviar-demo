import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';


const EmployeesSalary = () => {

  const [listofemployee, setlistofemployee] = useState([])
  const getemployees = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/employee')
      const employee = await response.data
      setlistofemployee(employee)
    } catch (error) {
      console.log(error)
    }
  }
  const [listofmovement, setlistofmovement] = useState(['سلف', 'خصم', 'غياب','اضافي','مكافأة'])
  const [salarymovementId, setsalarymovementId] = useState("")
  const [EmployeeId, setEmployeeId] = useState("")
  const [EmployeeName, setEmployeeName] = useState("")
  const [movement, setmovement] = useState("")
  const [Amount, setAmount] = useState()
  const [oldAmount, setoldAmount] = useState()
  const [newAmount, setnewAmount] = useState()
  const [actionBy, setactionBy] = useState("")
  const [actionAt, setactionAt] = useState(Date())

  const addSalaryMovement = async(e)=>{
    e.preventDefault()
    try {
      const SalaryMovement = await axios.post('https://caviar-api.vercel.app/api/salarymovement',{EmployeeId,EmployeeName,movement,Amount,oldAmount,newAmount,actionBy})
      console.log(SalaryMovement)
      getSalaryMovement()
    } catch (error) {
     console.log(error) 
    }
  }

const [listofsalarymovement, setlistofsalarymovement] = useState([])
const getSalaryMovement = async()=>{
  const movement = await axios.get('https://caviar-api.vercel.app/api/salarymovement')
  setlistofsalarymovement(movement.data)
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

  const deleteSalaryMovement = async (e) => {
    e.preventDefault()
    try {
      console.log(salarymovementId)
      const deleted = await axios.delete(`https://caviar-api.vercel.app/api/salarymovement/${salarymovementId}`)
      console.log(deleted)
      getemployees()
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    getSalaryMovement()
    getemployees()
  }, [])
  return (
    <detacontext.Consumer>
      {
        ({userlogininfo, EditPagination, startpagination, endpagination, setstartpagination, setendpagination}) => {
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
                        <a href="#addSalaryMovementModal" onClick={setactionBy(userlogininfo?userlogininfo.id:'')} className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافة حركة</span></a>
                        <a href="#deleteSalaryMovementModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف الكل</span></a>
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
                        <th>الحركة</th>
                        <th>المبلغ</th>
                        <th>المبلغ السابق</th>
                        <th>الاجمالي</th>
                        <th>بواسطه</th>
                        <th>اليوم</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterEmp.length > 0 ? filterEmp.map((mov, i) => {
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
                                <td>{mov.EmployeeName}</td>
                                <td>{mov.movement}</td>
                                <td>{mov.Amount}</td>
                                <td>{mov.oldAmount}</td>
                                <td>{mov.newAmount}</td>
                                <td>{mov.actionBy}</td>
                                <td>{mov.actionAt}</td>
                                <td>
                                <a href="#editSalaryMovementModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit" onClick={() => {
                                    setsalarymovementId(mov._id); setEmployeeName(mov.EmployeeName); setAmount(mov.Amount); setactionBy(mov.actionBy); setoldAmount(mov.oldAmount); setnewAmount(mov.newAmount); setactionAt(mov.actionAt); setmovement(mov.movement)
                                  }}>&#xE254;</i></a>
                                  <a href="#deleteSalaryMovementModal" className="delete" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Delete" onClick={() => setsalarymovementId(mov._id)}>&#xE872;</i></a>
                                </td>

                            </tr>
                          )
                        }
                      })
                        : listofsalarymovement.map((mov, i) => {
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
                                <td>{mov.EmployeeName}</td>
                                <td>{mov.movement}</td>
                                <td>{mov.Amount}</td>
                                <td>{mov.oldAmount}</td>
                                <td>{mov.newAmount}</td>
                                <td>{mov.actionBy}</td>
                                <td>{mov.actionAt}</td>
                                <td>
                                  <a href="#editSalaryMovementModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit" onClick={() => {
                                    setsalarymovementId(mov._id); setEmployeeName(mov.EmployeeName); setAmount(mov.Amount); setactionBy(mov.actionBy); setoldAmount(mov.oldAmount); setnewAmount(mov.newAmount); setactionAt(mov.actionAt); setmovement(mov.movement)
                                  }}>&#xE254;</i></a>
                                  <a href="#deleteSalaryMovementModal" className="delete" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Delete" onClick={() => setsalarymovementId(mov._id)}>&#xE872;</i></a>
                                </td>
                              </tr>
                            )
                          }
                        })
                      }
                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{listofsalarymovement.length > endpagination ? endpagination : listofsalarymovement.length}</b> من <b>{listofsalarymovement.length}</b> عنصر</div>
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
              <div id="addSalaryMovementModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={addSalaryMovement}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه تعامل جديد</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>الاسم</label>
                          <select form="carform" required  onChange={(e) =>{setEmployeeName(e.target.innerText);setEmployeeId(e.target.value)}}>
                            <option>اختر</option>
                            {listofemployee.map(employee =>{
                              return(
                                <option value={employee._id}>{employee.fullname}</option>
                              )
                            })}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>الحركه</label>
                          <select form="carform" required  onChange={(e) =>setmovement(e.target.value)}>
                            {listofmovement.map((movement, i) =>{
                              return(
                                <option value={movement}>{movement}</option>
                              )
                            })}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>المبلغ</label>
                          <input type="Number" className="form-control" required onChange={(e) => setAmount(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>المبلغ السابق</label>
                          <input type="Number" className="form-control" required onChange={(e) => setoldAmount(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الاجمالي</label>
                          <input type="Number" className="form-control" required onChange={(e) => setnewAmount(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>بواسطة</label>
                          <input type="text" className="form-control" readOnly  defaultValue={userlogininfo?userlogininfo.username:''}/>
                        </div>
                        <div className="form-group">
                          <label>التاريخ</label>
                          <input type="date" className="form-control" readOnly defaultValue={actionAt} />
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
              {/* <div id="editSalaryMovementModal" className="modal fade">
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
              </div> */}
              <div id="deleteSalaryMovementModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteSalaryMovement}>
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

export default EmployeesSalary