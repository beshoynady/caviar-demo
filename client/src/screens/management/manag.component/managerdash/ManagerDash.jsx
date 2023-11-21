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

  const fetchPendingOrder = async () => {
    try {
      const res = await axios.get('https://caviar-api.vercel.app/api/order');
      setallOrders(res.data);
      const recentStatus = res.data.filter((order) => order.status === 'انتظار');
      const recentPaymentStatus = res.data.filter((order) => order.payment_status === 'انتظار');
      setpending_order(recentStatus);
      setpending_payment(recentPaymentStatus);
    } catch (error) {
      console.log(error);
    }
  };


  const status = ['انتظار', 'موافق', 'ملغي']
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
  const paymentstatus = ['انتظار', 'تم الدفع']
  const changePaymentorderstauts = async (e, id) => {
    try {
      const payment_status = e.target.value
      const isActive =payment_status=='تم الدفع'? false : true;
      const order = axios.put('https://caviar-api.vercel.app/api/order/' + id, {
        payment_status ,isActive
      })
      fetchPendingOrder()
      setupdate(!update)
    } catch (error) {
      console.log(error)
    }
  }

  // ارسال ويتر 
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
    const help = 'ارسال ويتر';
    const waiter = specifiedWaiter();
    try {
      const order = await axios.put('https://caviar-api.vercel.app/api/order/' + id, {
        waiter,
        help,
      });
      fetchPendingOrder();
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

  const [userLoginInfo, setuserLoginInfo] = useState(null)
  const getUserInfoFromToken = () => {
    const employeetoken = localStorage.getItem('token_e');
    if (employeetoken) {
      const decodedToken = jwt_decode(employeetoken);
      setuserLoginInfo(decodedToken.employeeinfo);
      handleCashRegister(decodedToken.employeeinfo.id);
    } else {
      setuserLoginInfo(null);
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
          setupdate(!update);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to create expense');
    }
  };



  useEffect(() => {
    fetchPendingOrder();
    fetchActiveWaiters();
    getUserInfoFromToken();
  }, [update]);


  return (
    <detacontext.Consumer>
      {
        ({ userLoginInfo, usertitle, list_day_order, total_day_salse, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <section className='dashboard'>
              <ToastContainer/>
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
                        {list_day_order.length}
                      </h3>
                    </span>
                    <i className='bx bx-calendar-check'></i>
                  </li>
                  <li>
                    <span className="info">
                      <p>في الانتظار</p>
                      <h3>
                        {pending_order.length}
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
                      <p>اجمالي الاوردرات اليوم</p>
                      <h3>
                        {total_day_salse}
                      </h3>
                    </span>
                    <i className='bx bx-dollar-circle'></i>
                  </li>
                  <li>
                    <span className="info">
                      <p>رصيد الخزينه اليوم</p>
                      <h3>
                        {balance?balance:''}
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
                                    onClick={() => { changePaymentorderstauts({ target: { value: 'تم الدفع' } }, recent._id); RevenueRecording(userLoginInfo.id, recent.total, `${recent.serial} ${recent.table != null ? usertitle(recent.table) : usertitle(recent.user)}`) }}
                                  >
                                    تم الدفع
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
                      {pending_payment.filter((order) => order.payment_status == 'انتظار' && order.order_type == 'داخلي' && order.isActive == false || order.help !== 'لم يطلب').map((order, i) => {
                        return (
                          <li className="completed" key={i}>
                            <div className="task-title">
                              <p><i className='bx bx-check-circle'></i> {usertitle(order.table)}</p>
                              <p>{order.help}</p>
                              {order.help == 'يطلب مساعدة' || order.help == 'يطلب الفاتورة' ? <button type="button" className="btn btn-primary" onClick={() => sendWaiter(order._id)}>ارسال ويتر</button> :
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