import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { detacontext } from '../../../../App';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CashRegister = () => {
  const [cashRegisters, setCashRegisters] = useState([]);
  const [allEmployee, setallEmployee] = useState([]);
  const [name, setname] = useState('');
  const [balance, setbalance] = useState('');
  const [employee, setemployee] = useState('');
  const [cachID, setcachID] = useState('');

  const getEmployees = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/employee')
      const data = await response.data
      setallEmployee(data)
    } catch (error) {
      console.log(error)
    }
  }

  const getAllCashRegisters = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/cash');
      setCashRegisters(response.data);
    } catch (err) {
      toast.error('Error fetching cash registers');
    }
  };

  const getCashRegisterById = async (id) => {
    try {
      const response = await axios.get(`https://caviar-api.vercel.app/api/cash/${id}`);
      // Handle response (e.g., display details, update state)
    } catch (err) {
      toast.error('Cash register not found');
    }
  };

  const createCashRegister = async (e) => {
    e.preventDefault()
    const newCashRegister = { name, balance, employee };
    try {
      const response = await axios.post('https://caviar-api.vercel.app/api/cash', newCashRegister);
      // Handle response (e.g., update state, show success message)
      toast.success('Cash register created successfully');
      getAllCashRegisters()
    } catch (err) {
      toast.error('Failed to create cash register');
    }
  };

  const updateCashRegister = async (id) => {
    const updatedCashRegister = { name, balance, employee };
    try {
      const response = await axios.put(`https://caviar-api.vercel.app/api/cash/${cachID}`, updatedCashRegister);
      // Handle response (e.g., update state, show success message)
      toast.success('Cash register updated successfully');
      getAllCashRegisters()
    } catch (err) {
      toast.error('Failed to update cash register');
    }
  };

  const deleteCashRegister = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.delete(`https://caviar-api.vercel.app/api/cash/${cachID}`);
      // Handle response (e.g., update state, show success message)
      toast.success('Cash register deleted successfully');
    } catch (err) {
      toast.error('Failed to delete cash register');
    }
  };

  const filterCashRegistersByEmployee = (employeeid) => {
    const filteredRegisters = cashRegisters.filter(register => register.employee == employeeid);
    setCashRegisters(filteredRegisters);
  };

  const filterCashRegistersByName = (cashName) => {
    const filteredRegisters = cashRegisters.filter(register => register.name.startsWith(cashName) == true);
    setCashRegisters(filteredRegisters);
  };
  useEffect(() => {
    getAllCashRegisters()
    getEmployees()
  }, [])

  return (
    <detacontext.Consumer>
      {
        ({ EditPagination, usertitle, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <ToastContainer />
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6 text-right">
                        <h2>ادارة <b>الخزينه</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addCashRegisterModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه تصنيف</span></a>
                        <a href="#deleteCashRegisterModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
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
                        <div class="filter-group">
                          <label>اسم الصنف</label>
                          <input type="text" class="form-control" onChange={(e) => filterCashRegistersByName(e.target.value)} />
                          <button type="button" class="btn btn-primary"><i class="fa fa-search"></i></button>
                        </div>
                        <div class="filter-group">
                          <label>الموظف</label>
                          <select class="form-control" onChange={(e) => filterCashRegistersByEmployee(e.target.value)}>
                            <option >اختر</option>
                            {allEmployee.map((Employee, i) => {
                              return <option value={Employee._id} key={i} >{Employee.username}</option>
                            })
                            }
                          </select>
                        </div>
                        {/* 
                        <div class="filter-group">
                          <label>Status</label>
                          <select class="form-control">
                            <option>Any</option>
                            <option>Delivered</option>
                            <option>Shipped</option>
                            <option>Pending</option>
                            <option>Cancelled</option>
                          </select>
                        </div>
                        <span class="filter-icon"><i class="fa fa-filter"></i></span> */}
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
                        <th>الخزينة</th>
                        <th>المسؤل</th>
                        <th>الرصيد</th>
                        <th>اجراءات</th>
                      </tr>

                    </thead>
                    <tbody>
                      {cashRegisters && cashRegisters.map((cash, i) => {
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
                              <td>{cash.name}</td>
                              <td>{usertitle(cash.employee)}</td>
                              <td>{cash.balance}</td>
                              <td>
                                <a href="#editCashRegisterModal" className="edit" data-toggle="modal" onClick={() => { setcachID(cash._id); setname(cash.name); setemployee(cash.employee); setbalance(cash.balance) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

                                <a href="#deleteCashRegisterModal" className="delete" data-toggle="modal" onClick={() => setcachID(cash._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                              </td>
                            </tr>
                          )
                        }
                      })}

                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{cashRegisters.length > endpagination ? endpagination : cashRegisters.length}</b> من <b>{cashRegisters.length}</b> عنصر</div>
                    <ul className="pagination">
                      <li onClick={EditPagination} className="page-item disabled"><a href="#">السابق</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">1</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">2</a></li>
                      <li onClick={EditPagination} className="page-item active"><a href="#" className="page-link">3</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">4</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">5</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">التالي</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div id="addCashRegisterModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={createCashRegister}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه خزينه</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>الاسم</label>
                          <input type="text" className="form-control" required onChange={(e) => setname(e.target.value)} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>المسؤل</label>
                        <select name="Employee" id="Employee" form="carform" onChange={(e) => setemployee(e.target.value)}>
                          <option>احتر الموظف</option>
                          {allEmployee.map((Employee, i) => {
                            return <option value={Employee._id} key={i} >{Employee.username}</option>
                          })
                          }
                        </select>
                      </div>

                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-success" value="اضافه" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div id="editCashRegisterModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={updateCashRegister}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل التصنيف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>الاسم</label>
                          <input type="text" className="form-control" required defaultValue={name} onChange={(e) => setname(e.target.value)} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>المسؤل</label>
                        <select name="category" id="category" form="carform" defaultValue={employee} onChange={(e) => setemployee(e.target.value)}>
                          <option>احتر الموظف</option>
                          {allEmployee.map((Employee, i) => {
                            return <option value={Employee._id} key={i} >{Employee.username}</option>
                          })
                          }
                        </select>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-info" value="حفظ" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div id="deleteCashRegisterModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteCashRegister}>
                      <div className="modal-header">
                        <h4 className="modal-title">حذف تصنيف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا التصنيف?</p>
                        <p className="text-warning"><small>لا يمكن الرجوع فيه.</small></p>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
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

export default CashRegister