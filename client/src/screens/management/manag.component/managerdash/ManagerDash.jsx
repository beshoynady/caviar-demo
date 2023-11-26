import React, { useState, useEffect } from 'react'
import './ManagerDash.css'
import { detacontext } from '../../../../App'
import jwt_decode from 'jwt-decode';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';


const ManagerDash = () => {

  const [pending_order, setpending_order] = useState([])
  const [pending_payment, setpending_payment] = useState([])
  const [allOrders, setallOrders] = useState([])

  // Fetch pending orders from the API
  const fetchPendingOrders = async () => {
    try {
      const res = await axios.get('https://caviar-api.vercel.app/api/order');
      setallOrders(res.data);
      const recentStatus = res.data.filter(order => order.status === 'Pending');
      const recentPaymentStatus = res.data.filter(order => order.payment_status === 'Pending');
      setpending_order(recentStatus);
      setpending_payment(recentPaymentStatus);
      Payment_pending_orders()
    } catch (error) {
      console.log(error);
      // Handle errors here as needed
    }
  };

  const [list_day_order, setlist_day_order] = useState([]);
  const [total_day_sales, settotal_day_sales] = useState(0);

  const Payment_pending_orders = async () => {
    const dayorder = allOrders?allOrders.filter((order) => new Date(order.createdAt).getDay() == new Date().getDay()):[]
    setlist_day_order(dayorder)
    console.log(dayorder)
    if (dayorder.length > 0) {
      const order_day_paid = dayorder.filter((order) => order.payment_status == 'Paid')
      console.log(order_day_paid)
      let total = 0;
      if (order_day_paid.length > 0) {
        for (let i = 0; i < order_day_paid.length; i++) {
          total = order_day_paid[i].total + total
          settotal_day_sales(total)
        }
        // console.log(total_day_salse)
      }
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
      fetchPendingOrders()
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
      fetchPendingOrders();
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
          toast.success('Expense created successfully');
          Payment_pending_orders()
          setupdate(!update);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to create expense');
    }
  };



  useEffect(() => {
    fetchPendingOrders();
    fetchActiveWaiters();
    getUserInfoFromToken();
    Payment_pending_orders()
  }, [update]);


  return (
    <detacontext.Consumer>
      {
        ({ employeeLoginInfo, usertitle, list_day_order, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
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
                        {pending_payment.length}
                      </h3>
                    </span>
                    <i className='bx bx-line-chart'></i>
                  </li>
                  <li>
                    <span className="info">
                      <p>ايراد اليوم</p>
                      <h3>
                        {total_day_sales ? Math.round(total_day_sales * 100) / 100 : ''}
                      </h3>
                    </span>
                    <i className='bx bx-dollar-circle'></i>
                  </li>
                  <li>
                    <span className="info">
                      <p>رصيد الخزينه </p>
                      <h3>
                        {balance ? Math.round(balance * 100) / 100 : ''}
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
                                <td>{recent.serial}</td>
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
              </div>
            </section>
          )
        }
      }
    </detacontext.Consumer>
  )
}

export default ManagerDash