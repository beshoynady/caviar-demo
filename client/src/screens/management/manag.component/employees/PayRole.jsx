import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';


const PayRole = () => {

  const arryeofmonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const thismonth = new Date().getMonth() + 1

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
  // const [Month, setMonth] = useState()
  // const [salary, setsalary] = useState()
  // const [Additional, setAdditional] = useState()
  // const [Bonus, setBonus] = useState()
  // const [TotalDue, setTotalDue] = useState()
  // const [Absence, setAbsence] = useState()
  // const [Deduction, setDeduction] = useState()
  // const [Predecessor, setPredecessor] = useState()
  // const [Insurance, setInsurance] = useState()
  // const [Tax, setTax] = useState()
  // const [TotalDeductible, setTotalDeductible] = useState()
  // const [NetSalary, setNetSalary] = useState()

  const [listofsalarymovement, setlistofsalarymovement] = useState([])
  const getSalaryMovement = async () => {
    const movement = await axios.get('https://caviar-api.vercel.app/api/salarymovement')
    console.log(movement)
    setlistofsalarymovement(movement.data)
  }

  // const [showpayroll, setshowpayroll] = useState([])
  // const getPayRollEmployee = async () => {
  //   const month = new Date().getMonth()+1
  //   const p = {}
  //   listofemployee
  // }
  // const getPayRollEmployee = async (id) => {
  //   e.preventDefault()
  //   try {
  //     console.log(employeeid)
  //     const employee = await axios.get(`https://caviar-api.vercel.app/api/employee/${id}`)
  //     setsalary(employee.basicSalary)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // const movementArray = ['سلف', 'خصم', 'غياب', 'اضافي', 'مكافأة']

  const addPayRoll = async () => {
    let payRole = [{}]
    for (let i = 0; i < listofemployee.length; i++) {
      let id = listofemployee[i]._id
      setemployeeid(id)
      payRole[0].Month = new Date().getMonth() + 1
      let salary = listofemployee[i].basicSalary
      payRole[0].salary = salary

      let Predecessor = 0
      let Deduction = 0
      let Absence = 0
      let Additional = 0
      let Bonus = 0
      let TotalDue = 0
      let TotalDeductible = 0
      let Insurance = 0
      let Tax = 0
      let NetSalary = 0

      const employeemov = listofsalarymovement.length > 0 ? listofsalarymovement.filter((m) => m.EmployeeId == id) : '';
      console.log({employeemov:employeemov})

      if (employeemov.length > 0) {

        const filterPre = employeemov.filter((m) => m.movement == 'سلف')
        if (filterPre.length > 0) {
          Predecessor = filterPre[filterPre.length - 1].newAmount
          payRole[0].Predecessor = Predecessor
        }else{
          Predecessor=0
          payRole[0].Predecessor = Predecessor         
        }

        const filterDed = employeemov.filter((m) => m.movement == 'خصم')
        console.log(filterDed)
        if (filterDed.length > 0) {
          Deduction = filterDed[filterDed.length - 1].newAmount
          payRole[0].Deduction = Deduction
        }else{
          Deduction = 0
          payRole[0].Deduction = Deduction
        }

        const filterAbs = employeemov.filter((m) => m.movement == 'غياب')
        if (filterAbs.length > 0) {
          Absence = filterAbs[filterAbs.length - 1].newAmount
          payRole[0].Absence = Absence
        }else{
          Absence=0
          payRole[0].Absence = Absence
        }

        const filterAdd = employeemov.filter((m) => m.movement == 'اضافي')
        if (filterAdd.length > 0) {
          Additional = filterAdd[filterAdd.length - 1].newAmount
          payRole[0].Additional = Additional
        }else{
          Additional=0
          payRole[0].Additional = Additional
        }

        const filterBon = employeemov.filter((m) => m.movement == 'مكافأة')
        if (filterBon.length > 0) {
          Bonus = filterBon[filterBon.length - 1].newAmount
          payRole[0].Bonus = Bonus
        }else{
          Bonus=0
          payRole[0].Bonus = Bonus

        }
        // payRole[0].TotalDue = TotalDue
        // payRole[0].TotalDeductible = TotalDeductible
        // payRole[0].Insurance = Insurance
        // payRole[0].Tax = Tax
        // payRole[0].NetSalary = NetSalary

        // payRole[0].TotalDue = salary + Bonus + Additional
        // payRole[0].TotalDeductible = Absence + Deduction + Predecessor
        // payRole[0].Insurance = TotalDue * .10
        // payRole[0].Tax = TotalDue * 0.15
        TotalDue = salary + Bonus + Additional
        TotalDeductible = Absence + Deduction + Predecessor
        Insurance = TotalDue * .10
        Tax = TotalDue * 0.15


        payRole[0].TotalDue = TotalDue
        payRole[0].TotalDeductible = TotalDeductible
        payRole[0].Insurance = Insurance
        payRole[0].Tax =Tax 
        payRole[0].NetSalary = TotalDue - TotalDeductible - Insurance - Tax

        console.log(payRole)
        const result = await axios.put(`https://caviar-api.vercel.app/api/employee/payrole/${id}`, { payRole })
        console.log(result)
        if(result){
          payRole[0]={}
          Predecessor = 0
          Deduction = 0
          Absence = 0
          Additional = 0
          Bonus = 0
          TotalDue = 0
          TotalDeductible = 0
          Insurance = 0
          Tax = 0 
        }
      }else{
        payRole[0].salary = salary
        payRole[0].Bonus = Bonus
        payRole[0].Additional = Additional
        payRole[0].Absence = Absence
        payRole[0].Deduction = Deduction
        payRole[0].Predecessor = Predecessor

        TotalDue = salary + Bonus + Additional
        TotalDeductible = Absence + Deduction + Predecessor
        Insurance = TotalDue * .10
        Tax = TotalDue * 0.15

        NetSalary = TotalDue - TotalDeductible - Insurance - Tax
        
        payRole[0].TotalDue = TotalDue
        payRole[0].TotalDeductible = TotalDeductible
        payRole[0].Insurance = Insurance
        payRole[0].Tax =Tax 
        payRole[0].NetSalary = NetSalary
        console.log(payRole)
        const result = await axios.put(`https://caviar-api.vercel.app/api/employee/payrole/${id}`, { payRole })
        console.log(result)
        if(result){
          payRole[0]={}
          Predecessor = 0
          Deduction = 0
          Absence = 0
          Additional = 0
          Bonus = 0
          TotalDue = 0
          TotalDeductible = 0
          Insurance = 0
          Tax = 0
        }
      }
    }
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
        ({ EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
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
                        {/* <th>اجر اليوم</th>
                        <th>اجر الساعه</th>
                        <th>عدد ايام العمل</th> */}
                        <th>اضافي</th>
                        <th>مكافاة</th>
                        <th>اجمالي المستحق</th>
                        {/* <th>عدد ايام الغياب</th> */}
                        <th>خصم</th>
                        <th>غياب</th>
                        <th>سلف</th>
                        <th>اجمالي المستقطع</th>
                        <th>تامين</th>
                        <th>ضريبه</th>
                        <th>المستحق عن الشهر</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listofemployee && listofemployee.map((em, i) => {
                        if (em.payRole.length > 0) {
                          if (em.payRole[em.payRole.length - 1].Month == thismonth) {
                            return (
                              <tr key={i}>
                                <td>
                                  <span className="custom-checkbox">
                                    <input type="checkbox" id="checkbox1" name="options[]" value="1" />
                                    <label htmlFor="checkbox1"></label>
                                  </span>
                                </td>
                                <td>{i + 1}</td>
                                <td>{em.fullname}</td>
                                <td>{em.payRole[em.payRole.length - 1].salary}</td>
                                <td>{em.payRole[em.payRole.length - 1].Additional}</td>
                                <td>{em.payRole[em.payRole.length - 1].Bonus}</td>
                                <td>{em.payRole[em.payRole.length - 1].TotalDue}</td>
                                <td>{em.payRole[em.payRole.length - 1].Deduction}</td>
                                <td>{em.payRole[em.payRole.length - 1].Absence}</td>
                                <td>{em.payRole[em.payRole.length - 1].Predecessor}</td>
                                <td>{em.payRole[em.payRole.length - 1].TotalDeductible}</td>
                                <td>{em.payRole[em.payRole.length - 1].Insurance}</td>
                                <td>{em.payRole[em.payRole.length - 1].Tax}</td>
                                <td>{em.payRole[em.payRole.length - 1].NetSalary}</td>
                                <td>
                                  <a href="#editEmployeeModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit"
                                  // onClick={() => {
                                  //   setuserid(e._id); setusername(e.username); setaddress(e.address); setemail(e.email); setisAdmin(e.isAdmin); setisActive(e.isActive); setphone(e.phone); setrole(e.role); setsalary(e.salary)
                                  // }}
                                  >&#xE254;</i></a>
                                  <a href="#deleteEmployeeModal" className="delete" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Delete"
                                  // onClick={() => setuserid(e._id)}
                                  >&#xE872;</i></a>
                                </td>
                              </tr>
                            )

                          }
                        }
                      })}
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