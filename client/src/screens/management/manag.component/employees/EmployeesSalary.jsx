import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';


const EmployeesSalary = () => {

  // Existing state variables and useEffect
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

  const [listofmovement, setlistofmovement] = useState(['سلف', 'خصم', 'غياب', 'اضافي', 'مكافأة'])
  const [salarymovementId, setsalarymovementId] = useState("")
  const [EmployeeId, setEmployeeId] = useState("")
  const [EmployeeName, setEmployeeName] = useState("")
  const [movement, setmovement] = useState("")
  const [Amount, setAmount] = useState()
  const [oldAmount, setoldAmount] = useState(0)
  const [newAmount, setnewAmount] = useState()
  const [actionBy, setactionBy] = useState("")
  const [actionAt, setactionAt] = useState(Date())


  // Schema for data validation using Joi
  const schema = {
    EmployeeId: Joi.string().required(),
    EmployeeName: Joi.string().required(),
    movement: Joi.string().required(),
    Amount: Joi.number().min(0).required(),
    oldAmount: Joi.number().min(0).required(),
    newAmount: Joi.number().min(0).required(),
    actionBy: Joi.string().required(),
  };

  // Function to validate data based on schema
  const validate = (data) => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(data, schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  };

  // Function to add new salary movement
  const addSalaryMovement = async (e) => {
    e.preventDefault();
    const data = {
      EmployeeId,
      EmployeeName,
      movement,
      Amount,
      oldAmount,
      newAmount,
      actionBy,
    };

    // Validating the data before sending the request
    const errors = validate(data);
    if (errors) {
      toast.error('Please review the entered data');
      return;
    }

    try {
      const response = await axios.post('https://caviar-api.vercel.app/api/salarymovement', data);
      getSalaryMovement();
      toast.success('Movement added successfully');
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while adding the movement');
    }
  };

  // Function to update salary movement
  const updateSalaryMovement = async (e) => {
    e.preventDefault();
    const data = {
      EmployeeId,
      EmployeeName,
      movement,
      Amount,
      oldAmount,
      newAmount,
      actionBy,
    };

    // Validating the data before sending the request
    const errors = validate(data);
    if (errors) {
      toast.error('Please review the entered data');
      return;
    }

    try {
      const response = await axios.put(`https://caviar-api.vercel.app/api/salarymovement/${salarymovementId}`, data);
      getSalaryMovement();
      toast.success('Movement updated successfully');
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while updating the movement');
    }
  };

  // Function to delete salary movement
  const deleteSalaryMovement = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`https://caviar-api.vercel.app/api/salarymovement/${salarymovementId}`);
      getSalaryMovement();
      toast.success('Movement deleted successfully');
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while deleting the movement');
    }
  };

  const [listofsalarymovement, setlistofsalarymovement] = useState([])
  const getSalaryMovement = async () => {
    const movement = await axios.get('https://caviar-api.vercel.app/api/salarymovement')
    console.log(movement)
    setlistofsalarymovement(movement.data)
  }

  const [EmployeeSalaryMovement, setEmployeeSalaryMovement] = useState([])
  const filterEmployeeSalaryMovement = async (id) => {
    console.log(listofsalarymovement)
    const filterSalaryMovement = listofsalarymovement.length > 0 ? listofsalarymovement.filter(move => move.EmployeeId == id) : []
    console.log(filterSalaryMovement)
    if (filterSalaryMovement.length > 0) {
      setEmployeeSalaryMovement(filterSalaryMovement)
    }
  }


  const filterSalaryMovement = async (m) => {
    const filterm = EmployeeSalaryMovement.filter(move => move.movement == m)
    console.log(filterm)
    if (filterm.length > 0) {
      setoldAmount(filterm[filterm.length - 1].newAmount)
    } else {
      setoldAmount(0)
    }
  }

  const [filterEmp, setfilterEmp] = useState([])
  const getSalaryMovementByemp = (id) => {
    if (filterEmp.length > 0) {
      const filterlist = filterEmp.filter(m => m.EmployeeId == id)
      setfilterEmp(filterlist)

    } else {
      const FilterByEmployees = listofsalarymovement.filter(m => m.EmployeeId == id)
      setfilterEmp(FilterByEmployees)
    }
  }

  const filterEmpSalaryMovement = (mov) => {
    console.log(mov)
    console.log(filterEmp)
    console.log(listofsalarymovement)
    if (filterEmp.length > 0) {
      const filterlist = filterEmp.filter(m => m.movement == mov)
      setfilterEmp(filterlist)
    } else {
      const filterlist = listofsalarymovement.filter(m => m.movement == mov)
      console.log(filterlist)
      setfilterEmp(filterlist)
    }
  }

  useEffect(() => {
    getSalaryMovement()
    getemployees()
  }, [])
  return (
    <detacontext.Consumer>
      {
        ({ userlogininfo, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
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
                        <a href="#addSalaryMovementModal" onClick={() => { setactionBy(userlogininfo ? userlogininfo.id : '') }} className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافة حركة</span></a>
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
                          <label>الموظف</label>
                          <select class="form-control" onChange={(e) => getSalaryMovementByemp(e.target.value)} >
                            <option>الكل</option>
                            {listofemployee.map((em, i) => {
                              return (
                                <option value={em._id} key={i}>{em.fullname}</option>
                              )
                            })}
                          </select>
                        </div>
                        <div class="filter-group">
                          <label>العملية</label>
                          <select class="form-control" onChange={(e) => filterEmpSalaryMovement(e.target.value)} >
                            <option >الكل</option>
                            {listofmovement.map((m, i) => {
                              return (
                                <option value={m} key={i}>{m}</option>
                              )
                            })}
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
                        <h4 className="modal-title">Add New Transaction</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>Name</label>
                          <select form="carform" required onChange={(e) => {
                            setEmployeeName(listofemployee.find(em => em._id == e.target.value).fullname); setEmployeeId(e.target.value);
                            filterEmployeeSalaryMovement(e.target.value)
                          }}>
                            <option>Select</option>
                            {listofemployee.map((employee, i) => {
                              return (
                                <option value={employee._id} key={i}>{employee.fullname}</option>
                              )
                            })}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Movement</label>
                          <select form="carform" required onChange={(e) => { filterSalaryMovement(e.target.value); setmovement(e.target.value) }}>
                            {listofmovement.map((movement, i) => {
                              return (
                                <option value={movement} key={i}>{movement}</option>
                              )
                            })}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Amount</label>
                          <input type="number" min={0} className="form-control" required pattern="[0-9]+" onChange={(e) => { setAmount(e.target.value); setnewAmount(Number(oldAmount) + Number(e.target.value)) }} />
                          <small className="text-danger">Please enter a valid number.</small>
                        </div>
                        <div className="form-group">
                          <label>Old Amount</label>
                          <input type="number" className="form-control" value={oldAmount > 0 ? oldAmount : 0} readOnly />
                        </div>
                        <div className="form-group">
                          <label>Total Amount</label>
                          <input type="number" className="form-control" readOnly defaultValue={newAmount} />
                        </div>
                        <div className="form-group">
                          <label>By</label>
                          <input type="text" className="form-control" readOnly defaultValue={userlogininfo ? userlogininfo.username : ''} />
                        </div>
                        <div className="form-group">
                          <label>Date</label>
                          <input type="text" className="form-control" readOnly defaultValue={actionAt} />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="Close" />
                        <input type="submit" className="btn btn-success" value="Add" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div id="editSalaryMovementModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={updateSalaryMovement}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل بيانات الموظفين</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>الاسم</label>
                          <select form="carform" defaultValue={EmployeeName} required onChange={(e) => { setEmployeeName(listofemployee.find(em => em._id == e.target.value).fullname); setEmployeeId(e.target.value); filterEmployeeSalaryMovement(e.target.value) }}>
                            <option>اختر</option>
                            {listofemployee.map(employee => {
                              return (
                                <option value={employee._id}>{employee.fullname}</option>
                              )
                            })}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>الحركه</label>
                          <select form="carform" defaultValue={movement} required onChange={(e) => { filterSalaryMovement(e.target.value); setmovement(e.target.value) }}>
                            {listofmovement.map((movement, i) => {
                              return (
                                <option value={movement} key={i}>{movement}</option>
                              )
                            })}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>المبلغ</label>
                          <input type="Number" className="form-control" defaultValue={Amount} required onChange={(e) => { setAmount(e.target.value); setnewAmount(Number(oldAmount) + Number(e.target.value)) }} />
                        </div>
                        <div className="form-group">
                          <label>المبلغ السابق</label>
                          <input type="Number" className="form-control" Value={oldAmount > 0 ? oldAmount : 0} readOnly />
                        </div>
                        <div className="form-group">
                          <label>الاجمالي</label>
                          <input type="Number" className="form-control" readOnly defaultValue={newAmount} />
                        </div>
                        <div className="form-group">
                          <label>بواسطة</label>
                          <input type="text" className="form-control" readOnly defaultValue={userlogininfo ? userlogininfo.username : ''} />
                        </div>
                        <div className="form-group">
                          <label>التاريخ</label>
                          <input type="text" className="form-control" readOnly defaultValue={actionAt} />
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