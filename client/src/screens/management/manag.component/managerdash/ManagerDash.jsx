import React, { useState, useEffect } from 'react'
import './ManagerDash.css'
import { detacontext } from '../../../../App'
import jwt_decode from 'jwt-decode';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';


const ManagerDash = () => {
  const [pending_order, setpending_order] = useState([]);
  const [pending_payment, setpending_payment] = useState([]);
  const [allOrders, setallOrders] = useState([]);
  const [list_day_order, setlist_day_order] = useState([]);
  const [total_day_salse, settotal_day_salse] = useState(0);

  const fetchData = async () => {
    try {
      const res = await axios.get('https://caviar-api.vercel.app/api/order');
      setallOrders(res.data);
      const recentStatus = res.data.filter((order) => order.status === 'Pending');
      const recentPaymentStatus = res.data.filter((order) => order.payment_status === 'Pending');
      setpending_order(recentStatus);
      setpending_payment(recentPaymentStatus);

      const dayorder = res.data.filter((order) => new Date(order.createdAt).getDay() === new Date().getDay());
      setlist_day_order(dayorder);

      if (dayorder.length > 0) {
        const order_day_paid = dayorder.filter((order) => order.payment_status === 'Paid');
        let total = 0;

        if (order_day_paid.length > 0) {
          for (let i = 0; i < order_day_paid.length; i++) {
            total += order_day_paid[i].total;
          }
          settotal_day_salse(total);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };


  const status = ['Pending', 'Approved', 'Cancelled']
  const [update, setupdate] = useState(false)

  const changeorderstauts = async (e, id) => {
    try {
      const status = await e.target.value
      const order = await axios.put('https://caviar-api.vercel.app/api/order/' + id, {
        status
      })

      setupdate(!update)
    } catch (error) {
      console.log(error)
    }

  }
  const paymentstatus = ['Pending', 'Paid']
  const changePaymentorderstauts = async (e, id, casher) => {
    try {
      const payment_status = e.target.value
      const isActive = payment_status == 'Paid' ? false : true;
      const order = axios.put('https://caviar-api.vercel.app/api/order/' + id, {
        payment_status, isActive, casher
      })
      fetchData()
      setupdate(!update)
    } catch (error) {
      console.log(error)
    }
  }

  // Send waiter 
  const [waiters, setwaiters] = useState([])

  const fetchActiveWaiters = async () => {
    try {
      const allemployee = await axios.get('https://caviar-api.vercel.app/api/employee');
      const allwaiter = allemployee.data.filter((employee) => employee.role === 'waiter');
      const waiterActive = allwaiter.filter((waiter) => waiter.isActive === true);
      const listId = waiterActive.map((waiter) => waiter._id);
      if (listId.length > 0) {
        setwaiters(listId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const [waiter, setwaiter] = useState()
  const specifiedWaiter = () => {
    const ordertakewaiter = allOrders.filter((order) => order.waiter != null)
    console.log(ordertakewaiter)
    const lastwaiter = ordertakewaiter.length > 0 ? ordertakewaiter[ordertakewaiter.length - 1].waiter : ''
    console.log(lastwaiter)

    const indexoflastwaiter = lastwaiter != '' ? waiters.indexOf(lastwaiter) : 0

    if (waiters.length == indexoflastwaiter + 1) {
      const waiter = waiters[0]
      return waiter
    } else {
      const waiter = waiters[indexoflastwaiter + 1]
      return waiter
    }
  }



  const sendWaiter = async (id) => {
    const help = 'Send waiter';
    const waiter = specifiedWaiter();
    try {
      const order = await axios.put('https://caviar-api.vercel.app/api/order/' + id, {
        waiter,
        help,
      });
      setupdate(!update);
      console.log(order.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [cashRegister, setcashRegister] = useState('');
  const [cashRegistername, setcashRegistername] = useState('');
  const [balance, setbalance] = useState();
  const [createBy, setcreateBy] = useState('');

  const [AllCashRegisters, setAllCashRegisters] = useState([]);

  const handleCashRegister = async (id) => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/cashregister');
      setAllCashRegisters(response.data.reverse());
      const data = response.data;
      const CashRegister = data ? data.find((cash) => cash.employee === id) : {};
      if (CashRegister) {
        setcashRegister(CashRegister._id);
        setcashRegistername(CashRegister.name);
        setbalance(CashRegister.balance);
        setcreateBy(id);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const RevenueRecording = async (id, amount, description) => {
    handleCashRegister(id);
    try {
      if (cashRegister) {
        const updatedBalance = balance + amount;
        const cashMovement = await axios.post('https://caviar-api.vercel.app/api/cashMovement/', {
          registerId: cashRegister,
          createBy,
          amount,
          type: 'Revenue',
          description,
        });
        const updatecashRegister = await axios.put(`https://caviar-api.vercel.app/api/cashregister/${cashRegister}`, {
          balance: updatedBalance,
        });
        if (updatecashRegister) {
          setbalance(updatedBalance);
          fetchData()
          toast.success('Expense created successfully');
          setupdate(!update);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to create expense');
    }
  };


  const [employeeLoginInfo, setemployeeLoginInfo] = useState(null)
  const getUserInfoFromToken = () => {
    const employeetoken = localStorage.getItem('token_e');
    if (employeetoken) {
      const decodedToken = jwt_decode(employeetoken);
      setemployeeLoginInfo(decodedToken.employeeinfo);
      handleCashRegister(decodedToken.employeeinfo.id);
    } else {
      setemployeeLoginInfo(null);
    }
  };

  const [list_products_order, setlist_products_order] = useState([])
  const [serial, setserial] = useState('')
  const [ivocedate, setivocedate] = useState('')
  const [ordertax, setordertax] = useState()
  const [ordertotal, setordertotal] = useState()
  const [ordersubtotal, setordersubtotal] = useState()
  const [orderdeliveryCost, setorderdeliveryCost] = useState()

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
      setivocedate(order.createAt)
    } catch (error) {
      console.log(error);
      // Display toast or handle error
    }
  };

  useEffect(() => {
    fetchData()
    fetchActiveWaiters();
    getUserInfoFromToken();
  }, [update]);


  return (
    <detacontext.Consumer>
      {
        ({ employeeLoginInfo, usertitle, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <section className='dashboard'>
              <ToastContainer />
              <div className='container'>
                <div className="header">
                  <div className="left">
                    <h1>الصفحة الرئيسيه</h1>
                  </div>
                  <a href={`http://${window.location.hostname}`} className="website">
                    <i className='bx bx-cloud-download'></i>
                    <span>الموقع</span>
                  </a>
                </div>

                <ul className="insights">
                  <li>
                    <span className="info">
                      <p>اوردرات اليوم</p>
                      <h3>
                        {list_day_order ? list_day_order.length : 0}
                      </h3>
                    </span>
                    <i className='bx bx-calendar-check'></i>
                  </li>
                  <li>
                    <span className="info">
                      <p>في الانتظار</p>
                      <h3>
                        {pending_order ? pending_order.length : 0}
                      </h3>
                    </span>
                    <i className='bx bx-show-alt'></i>
                  </li>
                  <li>
                    <span className="info">
                      <p> انتظار الدفع</p>
                      <h3>
                        {pending_payment ? pending_payment.length : 0}
                      </h3>
                    </span>
                    <i className='bx bx-line-chart'></i>
                  </li>
                  <li>
                    <span className="info">
                      <p>ايراد اليوم</p>
                      <h3>
                        {total_day_salse ? Math.round(total_day_salse / 10) * 10 : 0}
                      </h3>
                    </span>
                    <i className='bx bx-dollar-circle'></i>
                  </li>
                  <li>
                    <span className="info">
                      <p>رصيد الخزينه </p>
                      <h3>
                        {balance ? Math.round(balance / 10) * 10 : 0}
                      </h3>
                    </span>
                    <i className='bx bx-dollar-circle'></i>
                  </li>
                </ul>

                <div className="bottom-data">
                  <div className="orders">
                    <div className="header">
                      <i className='bx bx-receipt'></i>
                      <h3>الاوردرات الحالية</h3>
                      <i className='bx bx-filter'></i>
                      <i className='bx bx-search'></i>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>م.</th>
                          <th>رقم الاوردر</th>
                          <th>العميل</th>
                          <th>الاجمالي</th>
                          <th>حالة الاوردر</th>
                          <th>الويتر</th>
                          <th>حاله الدفع</th>
                          <th>مكان الاوردر</th>

                        </tr>
                      </thead>
                      <tbody>
                        {pending_payment && pending_payment.map((recent, i) => {
                          if (i >= startpagination & i < endpagination) {
                            return (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td><a href="#invoiceOrderModal" data-toggle="modal" onClick={() => getProductsOrder(recent.serial)}>{recent.serial}</a></td>
                                <td>{recent.table != null ? usertitle(recent.table) : usertitle(recent.user)}</td>
                                <td>{recent.total}</td>
                                <td>
                                  <select name="status" id="status" form="carform" onChange={(e) => { changeorderstauts(e, recent._id) }}>
                                    <option value={recent.status}>{recent.status}</option>
                                    {status.map((state, i) => {
                                      return (
                                        <option value={state} key={i}>{state}</option>
                                      )
                                    })
                                    }
                                  </select>
                                </td>
                                <td>{recent.waiter ? usertitle(recent.waiter) : ''}</td>
                                <td>
                                  <button
                                    className="btn btn-primary"
                                    onClick={() => { changePaymentorderstauts({ target: { value: 'Paid' } }, recent._id, employeeLoginInfo.employeeinfo.id); RevenueRecording(employeeLoginInfo.id, recent.total, `${recent.serial} ${recent.table != null ? usertitle(recent.table) : usertitle(recent.user)}`) }}
                                  >
                                    Paid
                                  </button>
                                </td>
                                {/* <td>
                                  <select name="status" id="status" form="carform" onChange={(e) => { changePaymentorderstauts(e, recent._id) }}>
                                    {paymentstatus.map((state, i) => {
                                      return <option value={state} key={i}>{state}</option>
                                    })
                                    }
                                  </select>
                                </td> */}
                                <td>{recent.order_type}</td>
                              </tr>
                            )
                          }
                        })}
                      </tbody>
                    </table>
                    <div className="clearfix">
                      <div className="hint-text text-dark">عرض <b>{pending_payment.length > startpagination ? startpagination : pending_payment.length}</b> من <b>{pending_payment.length}</b> عنصر</div>
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

                  <div className="reminders">
                    <div className="header">
                      <i className='bx bx-note'></i>
                      <h3>متابعه الطاولة</h3>
                      <i className='bx bx-filter'></i>
                    </div>
                    <ul className="task-list">
                      {pending_payment.filter((order) => order.payment_status == 'Pending' && order.order_type == 'Internal' && order.isActive == false || order.help !== 'Not requested').map((order, i) => {
                        return (
                          <li className="completed" key={i}>
                            <div className="task-title">
                              <p><i className='bx bx-check-circle'></i> {usertitle(order.table)}</p>
                              <p>{order.help}</p>
                              {order.help == 'Requests assistance' || order.help == 'Requests bill' ? <button type="button" className="btn btn-primary" onClick={() => sendWaiter(order._id)}>Send waiter</button> :
                                <p>تم ارسال {usertitle(order.waiter)}</p>}
                            </div>
                            <i className='bx bx-dots-vertical-rounded'></i>
                          </li>
                        )

                      })}

                    </ul>
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
                          {/* Buttons */}
                          {/* <div>
                            <button className="btn btn-primary mr-2" onClick={() => { }}>Download Invoice</button>
                            <button className="btn btn-success" onClick={() => {}}>Print Invoice</button>
                          </div> */}
                          {/* Invoice Header */}
                          <div className="invoice-header" style={{ backgroundColor: '#343a40', color: '#ffffff', padding: '20px', textAlign: 'center' }}>
                            <h2>Restaurant Name</h2>
                            <p>Invoice #{serial} | Date: {new Date(ivocedate).toLocaleString('en-GB', { hour12: true })}|</p>
                          </div>

                          {/* Customer Information */}
                          <div className="customer-info text-dark" style={{ marginBottom: '20px' }}>
                            <h4>Customer Details</h4>
                            <p>Name: John Doe</p>
                            <p>Mobile: 123-456-7890</p>
                            <p>Address: 123 Main St, City</p>
                          </div>

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
                              {orderdeliveryCost && (
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
              </div>
            </section>
          )
        }
      }
    </detacontext.Consumer>
  )
}

export default ManagerDash