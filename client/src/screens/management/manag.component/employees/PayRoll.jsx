import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';
import { ToastContainer, toast } from 'react-toastify';


const PayRoll = () => {
  // Array of months in Arabic
  const months = [
    'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const arryeofmonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const [thismonth, setthismonth] = useState(new Date().getMonth() + 1)


  // State variables
  const [expenseID, setexpenseID] = useState('');
  const [cashMovementId, setcashMovementId] = useState('');
  const [dailyexpenseID, setdailyexpenseID] = useState('');
  const [expenseDescription, setexpenseDescription] = useState('');
  const [amount, setamount] = useState();
  const [balance, setbalance] = useState();
  const [cashRegister, setcashRegister] = useState('');
  const [cashRegistername, setcashRegistername] = useState('');
  const [paidBy, setpaidBy] = useState('');
  const [employeeId, setemployeeId] = useState('');
  const [employeeName, setemployeeName] = useState('');
  const [month, setmonth] = useState('');
  const [notes, setnotes] = useState('');
  const [allExpenses, setallExpenses] = useState([]);
  const [AllcashRegisters, setAllcashRegisters] = useState([]);

  // Fetch employees data from the API
  const [ListOfEmployee, setListOfEmployee] = useState([])
  const getEmployees = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/employee');
      setListOfEmployee(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch salary movement data from the API
  const [ListOfSalaryMovement, setListOfSalaryMovement] = useState([])
  const getSalaryMovement = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/salarymovement');
      const currentDate = new Date().getMonth();
      const filterByMonth = response.data.filter((m) => new Date(m.createdAt).getMonth() === currentDate);
      setListOfSalaryMovement(filterByMonth);
    } catch (error) {
      console.log(error);
    }
  };


  const addPayRoll = async () => {
    for (let i = 0; i < ListOfEmployee.length; i++) {

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
      let isPaid = false
      let salary = ListOfEmployee[i].basicSalary
      let month = new Date().getMonth() + 1
      let id = ListOfEmployee[i]._id
      setemployeeId(id)
      const employeemov = ListOfSalaryMovement.length > 0 ? ListOfSalaryMovement.filter((m) => m.EmployeeId == id) : '';
      console.log({ employeemov: employeemov })

      if (employeemov.length > 0) {

        const filterPre = employeemov.filter((m) => m.movement == 'سلف')
        if (filterPre.length > 0) {
          Predecessor = filterPre[filterPre.length - 1].newAmount
        } else {
          Predecessor = 0
        }

        const filterDed = employeemov.filter((m) => m.movement == 'خصم')
        console.log(filterDed)
        if (filterDed.length > 0) {
          Deduction = filterDed[filterDed.length - 1].newAmount
        } else {
          Deduction = 0
        }

        const filterAbs = employeemov.filter((m) => m.movement == 'غياب')
        if (filterAbs.length > 0) {
          Absence = filterAbs[filterAbs.length - 1].newAmount
          Absence = Absence
        } else {
          Absence = 0
          Absence = Absence
        }

        const filterAdd = employeemov.filter((m) => m.movement == 'اضافي')
        if (filterAdd.length > 0) {
          Additional = filterAdd[filterAdd.length - 1].newAmount
        } else {
          Additional = 0
        }

        const filterBon = employeemov.filter((m) => m.movement == 'مكافأة')
        if (filterBon.length > 0) {
          Bonus = filterBon[filterBon.length - 1].newAmount
        } else {
          Bonus = 0

        }
        TotalDue = salary + Bonus + Additional
        TotalDeductible = Absence + Deduction + Predecessor
        Insurance = TotalDue * .10
        Tax = TotalDue * 0.15
        NetSalary = TotalDue - TotalDeductible - Insurance - Tax

        const result = await axios.put(`https://caviar-api.vercel.app/api/employee/payroll/${id}`, {
          month,
          salary,
          additional: Additional,
          bonus: Bonus,
          totalDue: TotalDue,
          absence: Absence,
          deduction: Deduction,
          predecessor: Predecessor,
          insurance: Insurance,
          tax: Tax,
          totalDeductible: TotalDeductible,
          netSalary: NetSalary,
          isPaid,
        })
        console.log(result)
        if (result) {
          getEmployees()
        }
      } else {
        TotalDue = salary + Bonus + Additional
        TotalDeductible = Absence + Deduction + Predecessor
        Insurance = TotalDue * .10
        Tax = TotalDue * 0.15

        NetSalary = TotalDue - TotalDeductible - Insurance - Tax

        const result = await axios.put(`https://caviar-api.vercel.app/api/employee/payroll/${id}`, {
          month,
          salary,
          additional: Additional,
          bonus: Bonus,
          totalDue: TotalDue,
          absence: Absence,
          deduction: Deduction,
          predecessor: Predecessor,
          insurance: Insurance,
          tax: Tax,
          totalDeductible: TotalDeductible,
          netSalary: NetSalary,
          isPaid,
        })
        console.log(result)
        if (result) {
          getEmployees()
        }
      }

    }
  }

  const handelPaid = async (salary, manager, employee, name, paidMonth) => {
    try {
      console.log(manager)

      // Fetch all cash registers
      const response = await axios.get('https://caviar-api.vercel.app/api/cashRegister');
      const allCashRegisters = await response.data;
      console.log(response)
      console.log(allCashRegisters)
      // // Find the appropriate cash register
      // const cashRegister = allCashRegisters ? allCashRegisters.find(cash => cash.employee === manager) : {};
      // // Update selected cash register data
      // cashRegister(cashRegister._id);
      // setcashRegistername(cashRegister.name);
      // setbalance(cashRegister.balance);
      // // Set values and variables
      // setamount(salary);
      // setpaidBy(manager);
      // setemployeeId(employee);
      // setmonth(paidMonth);
      // setemployeeName(name);
      // // Update expense description
      // setexpenseDescription(`دفع راتب ${name} بمبلغ ${salary}`);
      // // Update notes
      // setnotes(`دفع راتب ${name} لشهر ${paidMonth}`);
    } catch (error) {
      // Handle errors and display an appropriate error message to the user
      console.error(error);
      toast.error('An issue occurred while processing salaries. Please try again.');
    }
  };



  // // Fetch all cash registers from the API
  // const getAllcashRegisters = async () => {
  //   try {
  //     const response = await axios.get('https://caviar-api.vercel.app/api/cashRegister');
  //     setAllcashRegisters(response.data);
  //   } catch (err) {
  //     toast.error('Error fetching cash registers');
  //   }
  // };

  // const handlecashRegister = (id) => {
  //   const cashRegister = AllcashRegisters ? AllcashRegisters.find((cash) => cash.employee === id) : {};
  //   setcashRegister(cashRegister._id);
  //   setcashRegistername(cashRegister.name);
  //   setbalance(cashRegister.balance);
  //   // setpaidBy(id);
  // };

  // Create daily expense based on selected cash register
  const createDailyExpense = async () => {
    const updatedBalance = balance - amount;
    try {
      const cashMovement = await axios.post('https://caviar-api.vercel.app/api/cashMovement/', {
        registerId: cashRegister,
        createBy: paidBy,
        amount,
        type: 'Withdraw',
        description: expenseDescription,
      });

      const cashMovementId = cashMovement.data.cashMovement._id;

      const dailyExpense = await axios.post('https://caviar-api.vercel.app/api/dailyexpense/', {
        expenseID,
        expenseDescription,
        cashRegister,
        cashMovementId,
        paidBy,
        amount,
        notes,
      });

      const updateCashRegister = await axios.put(`https://caviar-api.vercel.app/api/cashRegister/${cashRegister}`, {
        balance: updatedBalance,
      });

      if (updateCashRegister) {
        setbalance(updatedBalance);
        console.log('Expense created successfully');
      }
    } catch (error) {
      console.log(error);
      console.log('Failed to create expense');
    }
  };

  // Function to process and pay employee salary
  const paidSalary = async () => {
    try {
      // Create daily expense
      createDailyExpense();

      // Prepare payload for updating payroll status
      const payload = {
        isPaid: true,
        paidBy: paidBy,
        month: month,
      };

      // Update payroll status via API call
      const updatePayRoll = await axios.put(`https://caviar-api.vercel.app/api/employee/paid/${employeeId}`, payload);

      // Log the update result
      console.log(updatePayRoll);

      // Display a success toast notification upon successful payment
      toast.success('Salary payment processed successfully');
    } catch (error) {
      // Handle errors by displaying a toast notification
      console.error(error);
      toast.error('Failed to process salary payment');
    }
  };



  const [filterEmployees, setfilterEmployees] = useState([])

  const filterEmployeesByJob = (role) => {
    getEmployees()
    if (ListOfEmployee.length > 0) {
      const FilterEmployees = ListOfEmployee.filter(employee => employee.role == role)
      setfilterEmployees(FilterEmployees)
    }
  }
  const filterEmpByStatus = (status) => {
    console.log(status)
    getEmployees()
    const filteredEmployees = ListOfEmployee.filter(employee => employee.isActive == status)
    console.log(filteredEmployees)
    setfilterEmployees(filteredEmployees)

  }

  const searchByName = (Name) => {
    const employee = ListOfEmployee.filter((employee) => employee.fullname.startsWith(Name) == true)
    setfilterEmployees(employee)
  }


  // Fetch data on component mount
  useEffect(() => {
    getEmployees();
    getSalaryMovement();
    // getAllCashRegisters();
  }, []);
  return (
    <detacontext.Consumer>
      {
        ({ usertitle, EditPagination, employeeLoginInfo, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <ToastContainer />
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>الرواتب</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a className="btn btn-success" onClick={addPayRoll}><i className="material-icons">&#xE147;</i> <span>تحديث كشف المرتبات</span></a>
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
                          <label>الاسم</label>
                          <input type="text" class="form-control" onChange={(e) => searchByName(e.target.value)} />
                          <button type="button" class="btn btn-primary"><i class="fa fa-search"></i></button>
                        </div>
                        <div class="filter-group">
                          <label>الوظيفه</label>
                          <select class="form-control" onChange={(e) => filterEmployeesByJob(e.target.value)} >
                            <option>الكل</option>
                            <option value="manager">مدير</option>
                            <option value="casher">كاشير</option>
                            <option value="waiter">ويتر</option>
                            <option value="Chef">شيف</option>
                            <option value="deliveryman">ديليفري</option>
                          </select>
                        </div>
                        <div class="filter-group">
                          <label>الحالة</label>
                          <select class="form-control" onChange={(e) => filterEmpByStatus(e.target.value)}>
                            <option >الكل</option>
                            <option value={true}>متاح</option>
                            <option value={false}>غير متاح</option>
                          </select>
                        </div>
                        <div className="filter-group">
                          <label>الشهر</label>
                          <select className="form-control" onChange={(e) => { setthismonth(e.target.value); console.log(e.target.value) }}>
                            <option>الكل</option>
                            {arryeofmonth.map((month, i) => (
                              <option value={month} key={i}>{months[month - 1]}</option>
                            ))}
                          </select>
                        </div>
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
                        <th>الاسم</th>
                        <th>الوظيفه</th>
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
                        <th>دفع بواسطه</th>
                        <th>الدفع</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        filterEmployees.length > 0 ? filterEmployees.map((em, i) => {
                          if (em.isActive == true && em.payRoll.length > 0) {
                            return (

                              // {
                              em.payRoll.map((Roll, j) => {
                                return (
                                  Roll.Month == thismonth ?
                                    (
                                      <tr key={i}>
                                        <td>
                                          <span className="custom-checkbox">
                                            <input type="checkbox" id="checkbox1" name="options[]" value="1" />
                                            <label htmlFor="checkbox1"></label>
                                          </span>
                                        </td>
                                        <td>{i + 1}</td>
                                        <td>{em.fullname}</td>
                                        <td>{em.role}</td>
                                        <td>{Roll.salary}</td>
                                        <td>{Roll.Additional}</td>
                                        <td>{Roll.Bonus}</td>
                                        <td>{Roll.TotalDue}</td>
                                        <td>{Roll.Deduction}</td>
                                        <td>{Roll.Absence}</td>
                                        <td>{Roll.Predecessor}</td>
                                        <td>{Roll.TotalDeductible}</td>
                                        <td>{Roll.Insurance}</td>
                                        <td>{Roll.Tax}</td>
                                        <td>{Roll.NetSalary}</td>
                                        <td>{usertitle(Roll.paidBy)}</td>
                                        {Roll.isPaid === false ? (
                                          <td>
                                            <a
                                              href="#paidModal"
                                              type='button'
                                              className="btn btn-success"
                                              onClick={() => handelPaid(Roll.salary, employeeLoginInfo.employeeinfo.id, em._id, usertitle(em._id), Roll.Month)}
                                            >
                                              دفع
                                            </a>
                                          </td>
                                        ) : (
                                          <td>تم الدفع</td>
                                        )}
                                      </tr>
                                    )
                                    : ''
                                )
                              }
                              )
                              // }

                              // </tr >
                            )
                          }
                        })
                          :
                          ListOfEmployee.map((em, i) => {
                            if (em.isActive == true && em.payRoll.length > 0) {
                              return (
                                em.payRoll.map((Roll, j) => {
                                  return (
                                    Roll.Month == thismonth ?
                                      (
                                        <tr key={i}>
                                          <td>
                                            <span className="custom-checkbox">
                                              <input type="checkbox" id="checkbox1" name="options[]" value="1" />
                                              <label htmlFor="checkbox1"></label>
                                            </span>
                                          </td>
                                          <td>{i + 1}</td>
                                          <td>{em.fullname}</td>
                                          <td>{em.role}</td>
                                          <td>{Roll.salary}</td>
                                          <td>{Roll.Additional}</td>
                                          <td>{Roll.Bonus}</td>
                                          <td>{Roll.TotalDue}</td>
                                          <td>{Roll.Deduction}</td>
                                          <td>{Roll.Absence}</td>
                                          <td>{Roll.Predecessor}</td>
                                          <td>{Roll.TotalDeductible}</td>
                                          <td>{Roll.Insurance}</td>
                                          <td>{Roll.Tax}</td>
                                          <td>{Roll.NetSalary}</td>
                                          <td>{usertitle(Roll.paidBy)}</td>
                                          {Roll.isPaid === false ? (
                                            <td>
                                              <a
                                                href="#paidModal"
                                                type='button'
                                                className="btn btn-success"
                                                onClick={() => handelPaid(Roll.salary, employeeLoginInfo.employeeinfo.id, em._id, usertitle(em._id), Roll.Month)}
                                              >
                                                دفع
                                              </a>
                                            </td>
                                          ) : (
                                            <td>تم الدفع</td>
                                          )}
                                        </tr>
                                      )
                                      : ''
                                  )
                                }
                                )
                              )
                            }
                          })
                      }
                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{ListOfEmployee.length > endpagination ? endpagination : ListOfEmployee.length}</b> out of <b>{ListOfEmployee.length}</b> entries</div>
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
              <div id="paidModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={paidSalary}>
                      <div className="modal-header">
                        <h4 className="modal-title">دفع راتب</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>`هل انت متاكد من دفع ${amount} مرتب${employeeName}  ؟ `</p>
                        <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="الغاء" />
                        <input type="submit" className="btn btn-danger" value="تاكيد الدفع" />
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

export default PayRoll