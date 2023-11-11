import './Orders.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { detacontext } from '../../../../App'


const Orders = () => {

  const formatdate = (d) => {
    let date = new Date(d)
    let form_dt = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return form_dt;
  }
  
  const [listofoeders, setlistofoeders] = useState([])
  const getorders = async () => {
    const res = await axios.get('https://caviar-api.vercel.app/api/order')
    setlistofoeders(res.data)
  }
  const [orederid, setorederid] = useState()
  const deletorder = async () => {
    console.log(orederid)
    const id = orederid;
    await axios.delete('https://caviar-api.vercel.app/api/order/' + id).then((res) => console.log(res.data))
    getorders()
  }
  const [OrdersFilterd, setOrdersFilterd] = useState([])
  const searchBySerial = (serial) => {
    const orders = listofoeders.filter((order) => order.serial.toString().startsWith(serial) == true)
    setOrdersFilterd(orders)
  }
  const getemployeesByOrderType = (Type) => {
    const orders = listofoeders.filter((order) => order.order_type == Type)
    setOrdersFilterd(orders)
  }



  useEffect(() => {
    getorders()
  }, [])
  return (
    <detacontext.Consumer>
      {
        ({ usertitle, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>الاوردرات</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addOrderModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافة اوردر جديد</span></a>
                        <a href="#deleteOrderModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
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
                          <label>رقم الفاتورة</label>
                          <input type="text" class="form-control" onChange={(e) => searchBySerial(e.target.value)} />
                          <button type="button" class="btn btn-primary"><i class="fa fa-search"></i></button>
                        </div>
                        <div class="filter-group">
                          <label>نوع الاوردر</label>
                          <select class="form-control" onChange={(e) => getemployeesByOrderType(e.target.value)} >
                            <option value={""}>الكل</option>
                            <option value="داخلي" >داخلي</option>
                            <option value="ديلفري" >ديلفري</option>
                            <option value="تيك اوي" >تيك اوي</option>
                          </select>
                        </div>
                        {/* <div class="filter-group">
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
                        <th>رقم الاوردر</th>
                        <th>العميل</th>
                        <th>المكان</th>
                        <th>الاجمالي</th>
                        <th>حالة الطلب</th>
                        <th>حالة الدفع</th>
                        <th>تاريخ الدفع</th>
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {OrdersFilterd.length > 0 ?
                        OrdersFilterd.map((o, i) => {
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
                                <td>{o.serial}</td>
                                <td>{o.table != null ? usertitle(o.table)
                                  : o.user ? usertitle(o.user)
                                    : o.employee ? usertitle(o.employee) : ''}</td>
                                <td>{o.order_type == 'داخلي' ? usertitle(o.table) : o.order_type}</td>
                                <td>{o.total}</td>
                                <td>{o.status}</td>
                                <td>{o.payment_status}</td>
                                <td>{formatdate(o.payment_date)}</td>
                                <td>
                                  <a href="#editOrderModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                  <a href="#deleteOrderModal" className="delete" data-toggle="modal" onClick={() => setorederid(o._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                </td>
                              </tr>
                            )
                          }
                        })
                        : listofoeders.map((o, i) => {
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
                                <td>{o.serial}</td>
                                <td>{o.table != null ? usertitle(o.table)
                                  : o.user ? usertitle(o.user)
                                    : o.employee ? usertitle(o.employee) : ''}</td>
                                <td>{o.order_type == 'داخلي' ? usertitle(o.table) : o.order_type}</td>
                                <td>{o.total}</td>
                                <td>{o.status}</td>
                                <td>{o.payment_status}</td>
                                <td>{formatdate(o.payment_date)}</td>
                                <td>
                                  <a href="#editOrderModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                  <a href="#deleteOrderModal" className="delete" data-toggle="modal" onClick={() => setorederid(o._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                </td>
                              </tr>
                            )
                          }
                        })
                      }

                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dart">عرض <b>{listofoeders.length > endpagination ? endpagination : listofoeders.length}</b> من <b>{listofoeders.length}</b> عنصر</div>
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
              <div id="addOrderModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form>
                      <div className="modal-header">
                        <h4 className="modal-title"></h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>Name</label>
                          <input type="text" className="form-control" required />
                        </div>
                        <div className="form-group">
                          <label>Email</label>
                          <input type="email" className="form-control" required />
                        </div>
                        <div className="form-group">
                          <label>Address</label>
                          <textarea className="form-control" required></textarea>
                        </div>
                        <div className="form-group">
                          <label>Phone</label>
                          <input type="text" className="form-control" required />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="Cancel" />
                        <input type="submit" className="btn btn-success" value="Add" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div id="editOrderModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form>
                      <div className="modal-header">
                        <h4 className="modal-title">Edit Order</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>Name</label>
                          <input type="text" className="form-control" required />
                        </div>
                        <div className="form-group">
                          <label>Email</label>
                          <input type="email" className="form-control" required />
                        </div>
                        <div className="form-group">
                          <label>Address</label>
                          <textarea className="form-control" required></textarea>
                        </div>
                        <div className="form-group">
                          <label>Phone</label>
                          <input type="text" className="form-control" required />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="Cancel" />
                        <input type="submit" className="btn btn-info" value="Save" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div id="deleteOrderModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deletorder}>
                      <div className="modal-header">
                        <h4 className="modal-title">Delete Order</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا السجل؟?</p>
                        <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-toggle="modal" data-dismiss="modal" value="Cancel" />
                        <input type="submit" className="btn btn-danger" value="Delete" />
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

export default Orders