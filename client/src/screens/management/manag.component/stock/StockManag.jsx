import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App'


const StockManag = () => {
  const [StockItems, setStockItems] = useState([]);
  const getaStockItems = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/stockitem/');
      console.log(response.data)
      setStockItems(response.data)

    } catch (error) {
      console.log(error)
    }

  }

  const Stockmovement = ["مشتريات", "منصرف", "راجع", "هالك"];
  const [movement, setmovement] = useState('');
  const [itemId, setitemId] = useState("");
  const [unit, setunit] = useState('')
  const [Quantity, setQuantity] = useState(0);
  const [price, setprice] = useState(0);
  const [cost, setcost] = useState(0)
  const [oldCost, setoldCost] = useState(0)
  const [newcost, setnewcost] = useState(0)
  const [oldBalance, setoldBalance] = useState(0)
  const [newBalance, setnewBalance] = useState(0)



  const [actionId, setactionId] = useState("")
  const actionAt = new Date().toLocaleString()

  const createStockaction = async (e, userid) => {
    e.preventDefault();
    try {
      const actionBy = userid;

      console.log(actionBy)
      const changeItem = await axios.put(`https://caviar-api.vercel.app/api/stockitem/movement/${itemId}`, { newBalance, newcost, price })
      console.log(changeItem)

      if (changeItem.status == 200) {
        const response = await axios.post('https://caviar-api.vercel.app/api/stockmanag/', { itemId, movement, Quantity, cost, oldCost, unit, newBalance, oldBalance, price, actionBy, actionAt });
        console.log(response.data);
        getallStockaction()
        getaStockItems()
      }
    } catch (error) {
      console.log(error)
    }
  }


  const updateStockaction = async (e, userid) => {
    e.preventDefault();
    try {
      const actionBy = userid;

      console.log(actionBy)
      const changeItem = await axios.put(`https://caviar-api.vercel.app/api/stockitem/movement/${itemId}`, { newBalance, newcost, price })
      console.log(changeItem)

      if (changeItem.status == 200) {
        const response = await axios.put(`https://caviar-api.vercel.app/api/stockmanag/${actionId}`, { itemId, movement, Quantity, cost, unit, newBalance, oldBalance, price, actionBy });
        console.log(response.data);
        getallStockaction()
        getaStockItems()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const [AllStockactions, setAllStockactions] = useState([]);

  const getallStockaction = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/stockmanag/');
      console.log(response.data)
      const Stockactions = await response.data;
      setAllStockactions(Stockactions)
    } catch (error) {
      console.log(error)
    }

  }

  const deleteStockaction = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`https://caviar-api.vercel.app/api/stockmanag/${actionId}`);
      console.log(response);
      if (response) {
        getallStockaction();
      }
    } catch (error) {
      console.log(error)
    }
  }

  const itemname = (id) => {
    const item = StockItems.filter(item => item._id == id)[0]
    if (item) {
      return item.itemName
    } else {
      return 'غير متوفر'
    }
  }

  const [StockitemFilterd, setStockitemFilterd] = useState([])
  const searchByitem = (item) => {
    const items = AllStockactions.filter((action) => itemname(action.itemId).startsWith(item) == true)
    setStockitemFilterd(items)
  }
  const searchByaction = (action) => {
    const items = AllStockactions.filter((Stockactions) => Stockactions.movement == action)
    setStockitemFilterd(items)
  }

  // const calcBalance = (qu) => {
  //   console.log('+++++++++')
  //   console.log(quantity)
  //   const quantity = Number(qu)
  //   if (movement == 'منصرف') {
  //     setnewBalance(oldBalance - quantity)
  //     setnewcost(oldCost - cost)
  //   } else {
  //     console.log(oldBalance + quantity)
  //     setnewBalance(oldBalance + quantity)
  //     setnewcost(oldCost + cost)
  //   }
  // }

  useEffect(() => {
    getallStockaction()
    getaStockItems()
  }, [])

  useEffect(() => {
    if (movement == "منصرف" || movement == "هالك") {
      setnewBalance(Number(oldBalance) - Number(Quantity))
      setnewcost(oldCost - cost)
    } else {
      setnewBalance(Number(oldBalance) + Number(Quantity))
      setnewcost(oldCost + cost)
    }
  }, [Quantity, price])




  return (
    <detacontext.Consumer>
      {
        ({ userLoginInfo, usertitle, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>المخزون</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addStockactionModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه منتج جديد</span></a>

                        <a href="#deleteStockactionModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
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
                          <label>اسم الصنف</label>
                          <input type="text" class="form-control" onChange={(e) => searchByitem(e.target.value)} />
                        </div>
                        <div class="filter-group">
                          <label>نوع الاوردر</label>
                          <select class="form-control" onChange={(e) => searchByaction(e.target.value)} >
                            <option value={""}>الكل</option>
                            <option value="مشتريات" >مشتريات</option>
                            <option value="راجع" >راجع</option>
                            <option value="منصرف" >منصرف</option>
                            <option value="هالك" >هالك</option>
                          </select>
                        </div>
                        {/* <div class="filter-group">
                          <label>Location</label>
                          <select class="form-control">
                            <option>All</option>
                            <option>Berlin</option>
                            <option>London</option>
                            <option>Madrid</option>
                            <option>New York</option>
                            <option>Paris</option>
                          </select>
                        </div>
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
                        <th>اسم الصنف</th>
                        <th>الحركة</th>
                        <th>الكمية</th>
                        <th>الوحدة</th>
                        <th>السعر</th>
                        <th>الثمن</th>
                        <th>الرصيدالقديم</th>
                        <th>الرصيد الجديد</th>
                        <th>تاريخ الحركه</th>
                        <th>تم بواسطه</th>
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {StockitemFilterd.length > 0 ? StockitemFilterd.map((action, i) => {
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
                              <td>{itemname(action.itemId)}</td>
                              <td>{action.movement}</td>
                              <td>{action.Quantity}</td>
                              <td>{action.unit}</td>
                              <td>{action.price}</td>
                              <td>{action.cost}</td>
                              <td>{action.oldBalance}</td>
                              <td>{action.Balance}</td>
                              <td>{Date(action.actionAt).toLocaleString}</td>
                              <td>{usertitle(action.actionBy)}</td>
                              <td>
                                <a href="#editStockactionModal" className="edit" data-toggle="modal" onClick={() => { setactionId(action._id); setoldBalance(action.oldBalance); setoldCost(action.oldCost); setprice(action.price) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                <a href="#deleteStockactionModal" className="delete" data-toggle="modal" onClick={() => setactionId(action._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                              </td>
                            </tr>
                          )
                        }
                      })
                        : AllStockactions.map((action, i) => {
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
                                <td>{itemname(action.itemId)}</td>
                                <td>{action.movement}</td>
                                <td>{action.Quantity}</td>
                                <td>{action.unit}</td>
                                <td>{action.price}</td>
                                <td>{action.cost}</td>
                                <td>{action.oldBalance}</td>
                                <td>{action.Balance}</td>
                                <td>{Date(action.actionAt).toLocaleString}</td>
                                <td>{usertitle(action.actionBy)}</td>
                                <td>
                                  <a href="#editStockactionModal" className="edit" data-toggle="modal" onClick={() => { setactionId(action._id); setoldBalance(action.oldBalance); setoldCost(action.oldCost); setprice(action.price) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                  <a href="#deleteStockactionModal" className="delete" data-toggle="modal" onClick={() => setactionId(action._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                </td>
                              </tr>
                            )
                          }
                        })
                      }
                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{AllStockactions.length > endpagination ? endpagination : AllStockactions.length}</b> من <b>{AllStockactions.length}</b> عنصر</div>
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
              <div id="addStockactionModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={(e) => createStockaction(e, userLoginInfo.employeeinfo.id)}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه صنف بالمخزن</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>نوع الحركه</label>
                          <select name="" id="" onChange={(e) => setmovement(e.target.value)}>
                            <option >اختر الاجراء</option>
                            {Stockmovement.map((status, i) => {
                              return <option key={i} defaultValue={status}>{status}</option>
                            })}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>الصنف</label>
                          <select name="" id="" onChange={(e) => {
                            setitemId(e.target.value); setunit(StockItems.filter(i => i._id == e.target.value)[0].largeUnit);; setprice(StockItems.filter(i => i._id == e.target.value)[0].price)
                            setoldBalance(StockItems.filter(i => i._id == e.target.value)[0].Balance);
                            setoldCost(StockItems.filter(i => i._id == e.target.value)[0].cost)
                          }}>
                            <option >اختر الصنف</option>
                            {StockItems.map((item, i) => {
                              return <option key={i} value={item._id}>{item.itemName}</option>
                            })}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>الكمية</label>
                          <input type='Number' className="form-control" required onChange={(e) => { setQuantity(e.target.value); }} />
                          <input type='text' className="form-control" defaultValue={unit} readOnly />
                        </div>

                        <div className="form-group">
                          <label>السعر</label>
                          {movement == "منصرف" || movement == "هالك" || movement == "راجع" ?
                            <input type='Number' className="form-control" readOnly required defaultValue={price} />
                            : <input type='Number' className="form-control" required onChange={(e) => { setprice(Number(e.target.value)); setcost(e.target.value * Quantity) }} />
                          }
                        </div>
                        <div className="form-group">
                          <label>التكلفة</label>
                          <input type='Number' className="form-control" Value={cost} readOnly />
                        </div>
                        <div className="form-group">
                          <label>الرصيد</label>
                          <input type='text' className="form-control" Value={oldBalance} readOnly />
                        </div>
                        <div className="form-group">
                          <label>الرصيد الجديد</label>
                          <input type='text' className="form-control" Value={newBalance} readOnly />
                        </div>
                        <div className="form-group">
                          <label>التاريخ</label>
                          <input type="text" className="form-control" Value={actionAt} readOnly />
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
              <div id="editStockactionModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={(e) => updateStockaction(e, userLoginInfo.employeeinfo.id)}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه صنف بالمخزن</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>نوع الحركه</label>
                          <select name="" id="" onChange={(e) => setmovement(e.target.value)}>
                            <option >اختر الاجراء</option>
                            {Stockmovement.map((statu, i) => {
                              return <option key={i} defaultValue={statu}>{statu}</option>
                            })}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>الصنف</label>
                          <select name="" id="" onChange={(e) => { setitemId(e.target.value); setunit(StockItems.filter(i => i._id == e.target.value)[0].unit) }}>
                            <option >اختر الصنف</option>
                            {StockItems.map((item, i) => {
                              return <option key={i} value={item._id}>{item.itemName}</option>
                            })}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>الكمية</label>
                          <input type='Number' className="form-control" required onChange={(e) => { setQuantity(e.target.value); setcost(e.target.value * price) }} />
                          <input type='text' className="form-control" defaultValue={unit} readOnly />
                        </div>

                        <div className="form-group">
                          <label>السعر</label>
                          {movement == "منصرف" || movement == "هالك" ?
                            <input type='Number' className="form-control" readOnly required defaultValue={price} />
                            : <input type='Number' className="form-control" required onChange={(e) => { setprice(Number(e.target.value)); setcost(e.target.value * Quantity) }} />
                          }
                        </div>
                        <div className="form-group">
                          <label>التكلفة</label>
                          <input type='Number' className="form-control" Value={cost} readOnly />
                        </div>
                        <div className="form-group">
                          <label>الرصيد</label>
                          <input type='text' className="form-control" Value={oldBalance} readOnly />
                        </div>
                        <div className="form-group">
                          <label>الرصيد الجديد</label>
                          <input type='text' className="form-control" Value={newBalance} readOnly />
                        </div>
                        <div className="form-group">
                          <label>التاريخ</label>
                          <input type="text" className="form-control" Value={actionAt} readOnly />
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
              <div id="deleteStockactionModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteStockaction}>
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
          )
        }
      }
    </detacontext.Consumer>

  )
}

export default StockManag