import './Orders.css'
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { detacontext } from '../../../../App'
import { useReactToPrint } from 'react-to-print';
import { ToastContainer, toast } from 'react-toastify';


const Orders = () => {

  const formatdate = (d) => {
    let date = new Date(d)
    let form_dt = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return form_dt;
  }

  const [listOfOrders, setlistOfOrders] = useState([])
  // Fetch orders from API
  const getOrders = async () => {
    try {
      const res = await axios.get('https://caviar-api.vercel.app/api/order');
      setlistOfOrders(res.data.reverse());
    } catch (error) {
      console.log(error);
      // Display toast or handle error
    }
  };
  const [list_products_order, setlist_products_order] = useState([])
  const [serial, setserial] = useState('')
  const [ordertype, setordertype] = useState('')
  const [name, setname] = useState('')
  const [address, setaddress] = useState('')
  const [phone, setphone] = useState('')
  const [ordertax, setordertax] = useState()
  const [ordertotal, setordertotal] = useState()
  const [ordersubtotal, setordersubtotal] = useState()
  const [orderdeliveryCost, setorderdeliveryCost] = useState()
  const [ordernum, setordernum] = useState()
  const [table, settable] = useState()
  const [casher, setcasher] = useState()
  const [ivocedate, setivocedate] = useState('')

  // Fetch orders from API
  const getProductsOrder = async (serial) => {
    try {
      const res = await axios.get('https://caviar-api.vercel.app/api/order');
      const order = res.data.find(o => o.serial == serial)
      setlist_products_order(order.products)
      setordertotal(order.total)
      setordersubtotal(order.subTotal)
      setordertax(order.tax)
      setorderdeliveryCost(order.deliveryCost)
      setserial(order.serial)
      setivocedate(order.createdAt)
      setcasher(order.casher)
      settable(order.order_type == 'Internal' ? order.table : '')
      setordernum(order.order_type == 'Takeaway' ? order.ordernum : '')
      setordertype(order.order_type)
      setaddress(order.order_type == 'Delivery' ?order.address:"")
      if (order.order_type != 'Internal') {
        setname(order.name)
        setphone(order.phone)
      }

    } catch (error) {
      console.log(error);
      // Display toast or handle error
    }
  };


  const printContainer = useRef()

  const Print = useReactToPrint({
    content: () => printContainer.current,
    copyStyles: true,
    removeAfterPrint: true,
    bodyClass: 'printpage'
  });
  const handlePrint = (e) => {
    e.preventDefault()
    Print()
  }

  // State to manage order deletion
  const [orderId, setOrderId] = useState('');

  // Delete order
  const deleteOrder = async (e) => {
    e.preventDefault();
    try {
      const id = orderId;
      await axios.delete(`https://caviar-api.vercel.app/api/order/${id}`);
      getOrders();
      toast.success('Order deleted successfully');
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete order');
    }
  };

  // State for filtered orders
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Filter orders by serial number
  const searchBySerial = (serial) => {
    const orders = listOfOrders.filter((order) => order.serial.toString().startsWith(serial));
    setFilteredOrders(orders);
  };

  // Filter orders by order type
  const getOrdersByType = (type) => {
    const orders = listOfOrders.filter((order) => order.order_type === type);
    setFilteredOrders(orders);
  };

  // Fetch orders on component mount
  useEffect(() => {
    getOrders();
  }, []);

  return (
    <detacontext.Consumer>
      {
        ({ usertitle, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <ToastContainer />
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
                          <select class="form-control" onChange={(e) => getOrdersByType(e.target.value)} >
                            <option value={""}>الكل</option>
                            <option value="Internal" >Internal</option>
                            <option value="Delivery" >Delivery</option>
                            <option value="Takeaway" >Takeaway</option>
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
                        <th>رقم الفاتورة</th>
                        <th>رقم الاوردر</th>
                        <th>العميل</th>
                        <th>المكان</th>
                        <th>الاجمالي</th>
                        <th>حالة الطلب</th>
                        <th>الكاشير</th>
                        <th>حالة الدفع</th>
                        <th>تاريخ الدفع</th>
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length > 0 ?
                        filteredOrders.map((o, i) => {
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
                                <td>{o.ordernum ? o.ordernum : '--'}</td>
                                <td>{o.table != null ? usertitle(o.table)
                                  : o.user ? usertitle(o.user)
                                    : o.createBy ? usertitle(o.createBy) : '--'}</td>

                                <td>{o.order_type}</td>
                                <td>{o.total}</td>
                                <td>{o.status}</td>
                                <td>{usertitle(o.casher)}</td>
                                <td>{o.payment_status}</td>
                                <td>{new Date(o.payment_date).toLocaleString('en-GB', { hour12: true })}</td>
                                <td>
                                  <a href="#editOrderModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                  <a href="#deleteOrderModal" className="delete" data-toggle="modal" onClick={() => setOrderId(o._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                </td>
                              </tr>
                            )
                          }
                        })
                        : listOfOrders.map((o, i) => {
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
                                <td><a href="#invoiceOrderModal" data-toggle="modal" onClick={() => getProductsOrder(o.serial)}>{o.serial} </a></td>

                                <td>{o.ordernum ? o.ordernum : '--'}</td>
                                <td>{o.table != null ? usertitle(o.table)
                                  : o.user ? usertitle(o.user)
                                    : o.createBy ? usertitle(o.createBy) : '--'}</td>

                                <td>{o.order_type}</td>
                                <td>{o.total}</td>
                                <td>{o.status}</td>
                                <td>{usertitle(o.casher)}</td>
                                <td>{o.payment_status}</td>
                                <td>{new Date(o.payment_date).toLocaleString('en-GB', { hour12: true })}</td>

                                <td>
                                  <a href="#editOrderModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                  <a href="#deleteOrderModal" className="delete" data-toggle="modal" onClick={() => setOrderId(o._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                </td>
                              </tr>
                            )
                          }
                        })
                      }

                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{listOfOrders.length > endpagination ? endpagination : listOfOrders.length}</b> من <b>{listOfOrders.length}</b> عنصر</div>
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
              <div id="invoiceOrderModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form>
                      <div className="modal-header">
                        <h4 className="modal-title"></h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div ref={printContainer} className="container">
                        {/* Invoice Header */}
                        <div className="invoice-header" style={{ backgroundColor: '#343a40', color: '#ffffff', padding: '20px', textAlign: 'center' }}>
                          <h2>Restaurant Name</h2>
                          <p>Casher {usertitle(casher)} |Invoice #{serial} |{ordertype == 'Internal' ? `Table ${usertitle(table)}` : ''} |Date: {new Date(ivocedate).toLocaleString('en-GB', { hour12: true })}</p>
                        </div>

                        {/* Customer Information */}
                        {ordertype == 'Delivery' ? <div className="customer-info text-dark" style={{ marginBottom: '20px' }}>
                          <h4>Customer Details</h4>
                          <p>Name: {name}</p>
                          <p>Mobile: {phone}</p>
                          <p>Address: {address}</p>
                        </div> : ordertype == 'Takeaway' ?
                          <div className="customer-info text-dark" style={{ marginBottom: '20px' }}>
                            <h4>Customer Details</h4>
                            <p>Name: {name}</p>
                            <p>Mobile: {phone}</p>
                            <p>order num: {ordernum}</p>
                          </div>
                          : ''}

                        {/* Order Details Table */}
                        <table className="table table-bordered">
                          <thead className="thead-dark">
                            <tr>
                              <th scope="col">Item</th>
                              <th scope="col">Price</th>
                              <th scope="col">Quantity</th>
                              <th scope="col">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Example rows, replace with dynamic data */}
                            {list_products_order.map((item, i) => (
                              <tr key={i}>
                                <td>{item.name}</td>
                                <td>{item.priceAfterDiscount ? item.priceAfterDiscount : item.price}</td>
                                <td>{item.quantity}</td>
                                <td>{item.totalprice}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan="3">Subtotal</td>
                              <td>{ordersubtotal}</td>
                            </tr>
                            {orderdeliveryCost > 0 && (
                              <tr>
                                <td colSpan="3">Delivery</td>
                                <td>{orderdeliveryCost}</td>
                              </tr>
                            )}
                            <tr>
                              <td colSpan="3">Tax</td>
                              <td>{Math.round(ordertax * 100) / 100}</td>
                            </tr>
                            <tr>
                              <td colSpan="3">Total</td>
                              <td>{ordertotal}</td>
                            </tr>
                          </tfoot>
                        </table>

                        {/* Restaurant Information */}
                        <div className="restaurant-info text-dark" style={{ marginTop: '20px', textAlign: 'center' }}>
                          <h4>Restaurant Details</h4>
                          <p>Restaurant Name</p>
                          <p>Mobile: 987-654-3210</p>
                          <p>Address: 456 Street, City</p>
                        </div>

                        {/* Footer */}
                        <div className="footer" style={{ marginTop: '30px', textAlign: 'center', color: '#828282' }}>
                          <p>Developed by: <span style={{ color: '#5a6268' }}>esyservice</span></p>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="Cancel" />
                        <input type="submit" className="btn btn-success" value="Print" onClick={handlePrint} />
                      </div>
                    </form>
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
                    <form onSubmit={deleteOrder}>
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