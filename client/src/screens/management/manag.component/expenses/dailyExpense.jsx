import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { detacontext } from '../../../../App';

const DailyExpense = () => {
  const [expenseId, setexpenseId] = useState('');
  const [amount, setamount] = useState('');

  const [dailyExpenseId, setdailyExpenseId] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [notes, setNotes] = useState('');
  const [allExpenses, setAllExpenses] = useState([]);
  const [allDailyExpenses, setAllDailyExpenses] = useState([]);


  const getAllExpenses = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/expenses/');
      const expenses = await response.data;
      console.log(response.data);
      setAllExpenses(expenses);
    } catch (error) {
      console.log(error);
    }
  };

  const createDailyExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://caviar-api.vercel.app/api/dailyexpense/', {
        expenseID: expenseId,
        expenseDescription: description,
        quantity: quantity,
        totalAmount: totalAmount,
        notes: notes,
      });
      console.log(response.data);
      const updateexpense = await axios.put('https://caviar-api.vercel.app/api/expenses/',{amount : totalAmount})
      getAllDailyExpenses();
    } catch (error) {
      console.log(error);
    }
  };

  const editDailyExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://caviar-api.vercel.app/api/dailyexpense/${dailyExpenseId}`, {
        dailyExpenseId: dailyExpenseId,
        expenseDescription: description,
        quantity: quantity,
        totalAmount: totalAmount,
        notes: notes,
      });
      const data = response.data
      console.log(response.data);
      if(data){
        const updateexpense = await axios.put('https://caviar-api.vercel.app/api/expenses/',{amount : totalAmount})
        if (updateexpense.status === 200) {
          getAllDailyExpenses();
        }
      }

    } catch (error) {
      console.log(error);
    }
  };

  const deleteDailyExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`https://caviar-api.vercel.app/api/dailyexpense/${dailyExpenseId}`);
      if (response.status === 200) {
        console.log(response);
        getAllDailyExpenses();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllDailyExpenses = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/dailyexpense/');
      const dailyExpenses = await response.data;
      console.log(response.data);
      setAllDailyExpenses(dailyExpenses);
    } catch (error) {
      console.log(error);
    }
  };




  const [fielterDailyExpenses, setfielterDailyExpenses] = useState([])
  const searchByDailyExpense = (expense) => {
    const filter = allDailyExpenses.filter(exp => exp.description.startsWith(expense) == true)
    setfielterDailyExpenses(filter)
  }

  useEffect(() => {
    getAllExpenses();
    getAllDailyExpenses()
  }, [])

  return (
    <detacontext.Consumer>
      {({ EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
        return (
          <div className="container-xl mlr-auto">
            <div className="table-responsive mt-1">
              <div className="table-wrapper p-3 mw-100">
                <div className="table-title">
                  <div className="row">
                    <div className="col-sm-6 text-right">
                      <h2>ادارة <b>تسجيل المصروفات</b></h2>
                    </div>
                    <div className="col-sm-6 d-flex justify-content-end">
                      <a href="#addDailyExpensesModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه مصروف جديد</span></a>

                      <a href="#deleteDailyExpensesModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
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
                        <label>اسم المصروف</label>
                        <input type="text" class="form-control" onChange={(e) => searchByDailyExpense(e.target.value)} />
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
                      <th>اسم المصروف</th>
                      <th>المبلغ </th>
                      <th>الاجمالي </th>
                      <th>اضف في</th>
                      <th>ملاحظات</th>
                      <th>اجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fielterDailyExpenses.length > 0 ? fielterDailyExpenses.map((expense, i) => {
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
                            <td>{expense.expenseDescription}</td>
                            <td>{expense.quantity}</td>
                            <td>{expense.totalAmount}</td>
                            <td>{expense.date}</td>
                            <td>{expense.notes}</td>
                            <td>
                              <a href="#editDailyExpensesModal" className="edit" data-toggle="modal" onClick={() => {
                                setexpenseId(expense._id); setDescription(expense.expenseDescription)
                              }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                              <a href="#deleteDailyExpensesModal" className="delete" data-toggle="modal" onClick={() => setdailyExpenseId(expense._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                            </td>
                          </tr>
                        )
                      }
                    })
                      : allDailyExpenses.map((expense, i) => {
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
                              <td>{expense.expenseDescription}</td>
                              <td>{expense.quantity}</td>
                              <td>{expense.totalAmount}</td>
                              <td>{expense.date}</td>
                              <td>{expense.notes}</td>
                              {allDailyExpenses&&allDailyExpenses.filter(ex=>ex.expenseDescription == expense.expenseDescription)[allDailyExpenses.length-1]._id == expense._id ?
                              <td>
                                <a href="#editDailyExpensesModal" className="edit" data-toggle="modal" onClick={() => { setexpenseId(expense._id); setDescription(expense.expenseDescription);
                                setamount(expense.totalAmount - expense.quantity) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                <a href="#deleteDailyExpensesModal" className="delete" data-toggle="modal" onClick={() => setdailyExpenseId(expense._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                              </td> : ''}
                            </tr>
                          )
                        }
                      })}
                  </tbody>
                </table>
                <div className="clearfix">
                  <div className="hint-text text-dark">عرض <b>{allDailyExpenses.length > endpagination ? endpagination : allDailyExpenses.length}</b> من <b>{allDailyExpenses.length}</b> عنصر</div>
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
            <div id="addDailyExpensesModal" className="modal fade">
              <div className="modal-dialog">
                <div className="modal-content">
                  <form onSubmit={createDailyExpense}>
                    <div className="modal-header">
                      <h4 className="modal-title">تسجيل مصروف</h4>
                      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div className="modal-body">
                      <div className="form-group">
                        <label>المصروف</label>
                        <select name="category" id="category" form="carform" onChange={(e) => {
                          setexpenseId(e.target.value);
                          setDescription(allExpenses.find(ex => ex._id == e.target.value).description);
                          setamount(allExpenses.find(ex => ex._id == e.target.value).amount)
                        }}>
                          {allExpenses.map((expense, i) => {
                            return <option value={expense._id} key={i} >{expense.description}</option>
                          })
                          }
                        </select>
                      </div>
                      <div className="form-group">
                        <label>المبلغ</label>
                        <input type="Number" className="form-control" required onChange={(e) => { setQuantity(e.target.value); setTotalAmount(amount + Number(e.target.value)) }} />
                      </div>
                      <div className="form-group">
                        <label>الاجمالي </label>
                        <input type="Number" className="form-control" value={totalAmount} readOnly />
                      </div>
                      <div className="form-group w-100">
                        <label>ملاحظات</label>
                        <textarea className="form-control" required rows={2} cols={100} onChange={(e) => { setNotes(e.target.value) }} />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                      <input type="submit" className="btn btn-success" value="اضافه" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div id="editDailyExpensesModal" className="modal fade">
              <div className="modal-dialog">
                <div className="modal-content">
                  <form onSubmit={editDailyExpense}>
                    <div className="modal-header">
                      <h4 className="modal-title">تعديل صنف بالمخزن</h4>
                      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div className="modal-body">
                      <div className="form-group">
                        <label>المصروف</label>
                        <select name="category" id="category" defaultValue={expenseId} form="carform" onChange={(e) => {
                          setexpenseId(e.target.value);
                          setDescription(allExpenses.find(ex => ex._id == e.target.value).description);
                          
                        }}>
                          {allExpenses.map((expense, i) => {
                            return <option value={expense._id} key={i} >{expense.description}</option>
                          })
                          }
                        </select>
                      </div>
                      <div className="form-group">
                        <label>المبلغ</label>
                        <input type="Number" className="form-control" required onChange={(e) => { setQuantity(e.target.value); setTotalAmount(amount + Number(e.target.value)) }} />
                      </div>
                      <div className="form-group">
                        <label>الاجمالي </label>
                        <input type="Number" className="form-control" value={totalAmount} readOnly />
                      </div>
                      <div className="form-group w-100">
                        <label>ملاحظات</label>
                        <textarea className="form-control" required rows={2} cols={100} onChange={(e) => { setNotes(e.target.value) }} />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                      <input type="submit" className="btn btn-info" value="Save" />
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div id="deleteDailyExpensesModal" className="modal fade">
              <div className="modal-dialog">
                <div className="modal-content">
                  <form onSubmit={deleteDailyExpense}>
                    <div className="modal-header">
                      <h4 className="modal-title">حذف منتج</h4>
                      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div className="modal-body">
                      <p>هل انت متاكد من حذف هذا السجل؟</p>
                      <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
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
        );
      }}
    </detacontext.Consumer>
  );
};

export default DailyExpense;
