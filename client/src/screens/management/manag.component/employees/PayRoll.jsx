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

  // State variables
  const [listOfEmployee, setListOfEmployee] = useState([]);
  const [listOfSalaryMovement, setListOfSalaryMovement] = useState([]);
  const [expenseID, setExpenseID] = useState('658845918881bd1fa6a00407');
  const [cashRegister, setCashRegister] = useState('');
  const [cashRegisterName, setCashRegisterName] = useState('');
  const [balance, setBalance] = useState();
  const [notes, setNotes] = useState('');
  const [allCashRegisters, setAllCashRegisters] = useState([]);

  // Fetch employees data from the API
  const getEmployees = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/employee');
      setListOfEmployee(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch salary movement data from the API
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

  // Fetch all cash registers from the API
  const getAllCashRegisters = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/cashRegister');
      setAllCashRegisters(response.data.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  // Handle cash register selection
  const handleCashRegister = (id) => {
    const cashRegister = allCashRegisters.find((cash) => cash.employee === id);
    return cashRegister._id
  };

  // Create daily expense based on selected cash register
  const createDailyExpense = async (paidBy, amount, expenseDescription,cashRegister) => {
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
        setBalance(updatedBalance);
        console.log('Expense created successfully');
        getAllCashRegisters();
      }
    } catch (error) {
      console.log(error);
      console.log('Failed to create expense');
    }
  };

  // Function to process and pay employee salary
  const paidSalary = async (id, name, em, amount, month) => {
    try {
      // Set the description for the expense
      const expenseDescription = `تم دفع راتب ${name} بمبلغ ${amount}`;
      const note = `تم دفع راتب ${name} لشهر ${month}`;

      // Handle the selected cash register
      const cashRegister = handleCashRegister(em);

      // Check if a cash register is selected
      if (cashRegister) {
        // Create a daily expense entry
        createDailyExpense(em, amount, expenseDescription, note, cashRegister);
      }

      // Prepare payload for updating payroll status
      const payload = {
        isPaid: true,
        paidBy: em,
        month
      };

      // Update payroll status via API call
      const updatePayRoll = await axios.put(`https://caviar-api.vercel.app/api/employee/paid/${id}`, payload);

      // Log the update result
      console.log(updatePayRoll);
    } catch (error) {
      // Handle errors by displaying a toast notification
      console.error(error);
      toast.error('Failed to process salary payment');
    }
  };


  const [filterEmployees, setfilterEmployees] = useState([])

  const filterEmployeesByJob = (role) => {
    getemployees()
    if (listOfEmployee.length > 0) {
      const FilterEmployees = listOfEmployee.filter(employee => employee.role == role)
      setfilterEmployees(FilterEmployees)
    }
  }
  const filterEmpByStatus = (status) => {
    console.log(status)
    getemployees()
    const filteredEmployees = listOfEmployee.filter(employee => employee.isActive == status)
    console.log(filteredEmployees)
    setfilterEmployees(filteredEmployees)

  }

  const searchByName = (Name) => {
    const employee = listOfEmployee.filter((employee) => employee.fullname.startsWith(Name) == true)
    setfilterEmployees(employee)
  }


  // Fetch data on component mount
  useEffect(() => {
    getEmployees();
    getSalaryMovement();
    getAllCashRegisters();
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
                                        {Roll.isPaid == false ? (
                                          <td><button type='button' className="btn btn-success" onClick={() => paidSalary(em._id, usertitle(em._id), employeeLoginInfo.employeeinfo.id, Roll.NetSalary, Roll.Month)}
                                          > دفع</button></td>
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
                          listOfEmployee.map((em, i) => {
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
                                          {Roll.isPaid == false ? (
                                          <td><button type='button' className="btn btn-success" onClick={() => paidSalary(em._id, usertitle(em._id), employeeLoginInfo.employeeinfo.id, Roll.NetSalary, Roll.Month)}
                                          > دفع</button></td>
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
                    <div className="hint-text text-dark">عرض <b>{listOfEmployee.length > endpagination ? endpagination : listOfEmployee.length}</b> out of <b>{listOfEmployee.length}</b> entries</div>
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
            </div>
          )
        }
      }
    </detacontext.Consumer>
  )
}

export default PayRoll