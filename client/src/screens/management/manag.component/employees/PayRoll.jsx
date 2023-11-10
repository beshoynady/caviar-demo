import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';


const PayRoll = () => {

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
    const getmovement = await axios.get('https://caviar-api.vercel.app/api/salarymovement')
    const movement = getmovement.data
    console.log({ movement: movement})
    const date = new Date().getMonth()
    console.log({ date: date})
    movement.map((movement) => {
      console.log(new Date(movement.createdAt).getMonth())
    })
    // const filterByMonth = movement.filter((m)=>{Date(m.createdAt).getMonth() == date})
    // // const filterByMonth = movement.filter((m)=>{console.log(Date(m.createdAt)})
    // console.log(filterByMonth)
    // setlistofsalarymovement(filterByMonth)
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
    for (let i = 0; i < listofemployee.length; i++) {
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
      let salary = listofemployee[i].basicSalary
      let payRoll = listofemployee[i].payRoll
      let lastpayroll = payRoll[payRoll.length - 1]
      let thismonth = new Date().getMonth() + 1
      let id = listofemployee[i]._id
      setemployeeid(id)
      if(lastpayroll.Month == thismonth){
        payRoll[payRoll.length - 1].salary = salary
        const employeemov = listofsalarymovement.length > 0 ? listofsalarymovement.filter((m) => m.EmployeeId == id) : '';
        console.log({employeemov:employeemov})
  
        if (employeemov.length > 0) {
  
          const filterPre = employeemov.filter((m) => m.movement == 'سلف')
          if (filterPre.length > 0) {
            Predecessor = filterPre[filterPre.length - 1].newAmount
            payRoll[payRoll.length - 1].Predecessor = Predecessor
          }else{
            Predecessor=0
            payRoll[payRoll.length - 1].Predecessor = Predecessor         
          }
  
          const filterDed = employeemov.filter((m) => m.movement == 'خصم')
          console.log(filterDed)
          if (filterDed.length > 0) {
            Deduction = filterDed[filterDed.length - 1].newAmount
            payRoll[payRoll.length - 1].Deduction = Deduction
          }else{
            Deduction = 0
            payRoll[payRoll.length - 1].Deduction = Deduction
          }
  
          const filterAbs = employeemov.filter((m) => m.movement == 'غياب')
          if (filterAbs.length > 0) {
            Absence = filterAbs[filterAbs.length - 1].newAmount
            payRoll[payRoll.length - 1].Absence = Absence
          }else{
            Absence=0
            payRoll[payRoll.length - 1].Absence = Absence
          }
  
          const filterAdd = employeemov.filter((m) => m.movement == 'اضافي')
          if (filterAdd.length > 0) {
            Additional = filterAdd[filterAdd.length - 1].newAmount
            payRoll[payRoll.length - 1].Additional = Additional
          }else{
            Additional=0
            payRoll[payRoll.length - 1].Additional = Additional
          }
  
          const filterBon = employeemov.filter((m) => m.movement == 'مكافأة')
          if (filterBon.length > 0) {
            Bonus = filterBon[filterBon.length - 1].newAmount
            payRoll[payRoll.length - 1].Bonus = Bonus
          }else{
            Bonus=0
            payRoll[payRoll.length - 1].Bonus = Bonus
  
          }
          // payRoll[0].TotalDue = TotalDue
          // payRoll[0].TotalDeductible = TotalDeductible
          // payRoll[0].Insurance = Insurance
          // payRoll[0].Tax = Tax
          // payRoll[0].NetSalary = NetSalary
  
          // payRoll[0].TotalDue = salary + Bonus + Additional
          // payRoll[0].TotalDeductible = Absence + Deduction + Predecessor
          // payRoll[0].Insurance = TotalDue * .10
          // payRoll[0].Tax = TotalDue * 0.15
          TotalDue = salary + Bonus + Additional
          TotalDeductible = Absence + Deduction + Predecessor
          Insurance = TotalDue * .10
          Tax = TotalDue * 0.15
  
  
          payRoll[payRoll.length - 1].TotalDue = TotalDue
          payRoll[payRoll.length - 1].TotalDeductible = TotalDeductible
          payRoll[payRoll.length - 1].Insurance = Insurance
          payRoll[payRoll.length - 1].Tax =Tax 
          payRoll[payRoll.length - 1].NetSalary = TotalDue - TotalDeductible - Insurance - Tax
  
          console.log(payRoll)
          const result = await axios.put(`https://caviar-api.vercel.app/api/employee/payroll/${id}`, { payRoll })
          console.log(result)
          if(result){
            payRoll=[]
            getemployees()
            // Predecessor = 0
            // Deduction = 0
            // Absence = 0
            // Additional = 0
            // Bonus = 0
            // TotalDue = 0
            // TotalDeductible = 0
            // Insurance = 0
            // Tax = 0 
          }
        }else{
          payRoll[payRoll.length - 1].salary = salary
          payRoll[payRoll.length - 1].Bonus = Bonus
          payRoll[payRoll.length - 1].Additional = Additional
          payRoll[payRoll.length - 1].Absence = Absence
          payRoll[payRoll.length - 1].Deduction = Deduction
          payRoll[payRoll.length - 1].Predecessor = Predecessor
  
          TotalDue = salary + Bonus + Additional
          TotalDeductible = Absence + Deduction + Predecessor
          Insurance = TotalDue * .10
          Tax = TotalDue * 0.15
  
          NetSalary = TotalDue - TotalDeductible - Insurance - Tax
          
          payRoll[payRoll.length - 1].TotalDue = TotalDue
          payRoll[payRoll.length - 1].TotalDeductible = TotalDeductible
          payRoll[payRoll.length - 1].Insurance = Insurance
          payRoll[payRoll.length - 1].Tax =Tax 
          payRoll[payRoll.length - 1].NetSalary = NetSalary
          console.log(payRoll)
          const result = await axios.put(`https://caviar-api.vercel.app/api/employee/payroll/${id}`, { payRoll })
          console.log(result)
          if(result){
            payRoll=[]
            getemployees()
            // Predecessor = 0
            // Deduction = 0
            // Absence = 0
            // Additional = 0
            // Bonus = 0
            // TotalDue = 0
            // TotalDeductible = 0
            // Insurance = 0
            // Tax = 0
          }
        }
        
      }else{
        let payrollopject = {}
        payrollopject.Month = new Date().getMonth() + 1
        payrollopject.salary = salary
        const employeemov = listofsalarymovement.length > 0 ? listofsalarymovement.filter((m) => m.EmployeeId == id) : '';
        console.log({employeemov:employeemov})
  
        if (employeemov.length > 0) {
  
          const filterPre = employeemov.filter((m) => m.movement == 'سلف')
          if (filterPre.length > 0) {
            Predecessor = filterPre[filterPre.length - 1].newAmount
            payrollopject.Predecessor = Predecessor
          }else{
            Predecessor=0
            payrollopject.Predecessor = Predecessor         
          }
  
          const filterDed = employeemov.filter((m) => m.movement == 'خصم')
          console.log(filterDed)
          if (filterDed.length > 0) {
            Deduction = filterDed[filterDed.length - 1].newAmount
            payrollopject.Deduction = Deduction
          }else{
            Deduction = 0
            payrollopject.Deduction = Deduction
          }
  
          const filterAbs = employeemov.filter((m) => m.movement == 'غياب')
          if (filterAbs.length > 0) {
            Absence = filterAbs[filterAbs.length - 1].newAmount
            payrollopject.Absence = Absence
          }else{
            Absence=0
            payrollopject.Absence = Absence
          }
  
          const filterAdd = employeemov.filter((m) => m.movement == 'اضافي')
          if (filterAdd.length > 0) {
            Additional = filterAdd[filterAdd.length - 1].newAmount
            payrollopject.Additional = Additional
          }else{
            Additional=0
            payrollopject.Additional = Additional
          }
  
          const filterBon = employeemov.filter((m) => m.movement == 'مكافأة')
          if (filterBon.length > 0) {
            Bonus = filterBon[filterBon.length - 1].newAmount
            payrollopject.Bonus = Bonus
          }else{
            Bonus=0
            payRoll[payRoll.length - 1].Bonus = Bonus
  
          }
          TotalDue = salary + Bonus + Additional
          TotalDeductible = Absence + Deduction + Predecessor
          Insurance = TotalDue * .10
          Tax = TotalDue * 0.15
          NetSalary = TotalDue - TotalDeductible - Insurance - Tax

  
          payrollopject.TotalDue = TotalDue
          payrollopject.TotalDeductible = TotalDeductible
          payrollopject.Insurance = Insurance
          payrollopject.Tax =Tax 
          payrollopject.NetSalary = NetSalary 
          payRoll.push(payrollopject)
          console.log(payrollopject)
          const result = await axios.put(`https://caviar-api.vercel.app/api/employee/payroll/${id}`, { payRoll })
          console.log(result)
          if(result){
            payrollopject={}
            getemployees()
          }
        }else{
          let payrollopject = {}
          payrollopject.Month = new Date().getMonth() + 1
          payrollopject.salary = salary
  
          payrollopject.Bonus = Bonus
          payrollopject.Additional = Additional
          payrollopject.Absence = Absence
          payrollopject.Deduction = Deduction
          payrollopject.Predecessor = Predecessor
  
          TotalDue = salary + Bonus + Additional
          TotalDeductible = Absence + Deduction + Predecessor
          Insurance = TotalDue * .10
          Tax = TotalDue * 0.15
  
          NetSalary = TotalDue - TotalDeductible - Insurance - Tax
          
          payrollopject.TotalDue = TotalDue
          payrollopject.TotalDeductible = TotalDeductible
          payrollopject.Insurance = Insurance
          payrollopject.Tax =Tax 
          payrollopject.NetSalary = NetSalary
          console.log(payrollopject)
          const result = await axios.put(`https://caviar-api.vercel.app/api/employee/payroll/${id}`, { payRoll })
          console.log(result)
          if(result){
            payrollopject={}
            getemployees()
          }
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
                        if (em.payRoll.length > 0) {
                          if (em.payRoll[em.payRoll.length - 1].Month == thismonth) {
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
                                <td>{em.payRoll[em.payRoll.length - 1].salary}</td>
                                <td>{em.payRoll[em.payRoll.length - 1].Additional}</td>
                                <td>{em.payRoll[em.payRoll.length - 1].Bonus}</td>
                                <td>{em.payRoll[em.payRoll.length - 1].TotalDue}</td>
                                <td>{em.payRoll[em.payRoll.length - 1].Deduction}</td>
                                <td>{em.payRoll[em.payRoll.length - 1].Absence}</td>
                                <td>{em.payRoll[em.payRoll.length - 1].Predecessor}</td>
                                <td>{em.payRoll[em.payRoll.length - 1].TotalDeductible}</td>
                                <td>{em.payRoll[em.payRoll.length - 1].Insurance}</td>
                                <td>{em.payRoll[em.payRoll.length - 1].Tax}</td>
                                <td>{em.payRoll[em.payRoll.length - 1].NetSalary}</td>
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

export default PayRoll