import React, { useState, useEffect } from 'react'
import './ManagerDash.css'
import { detacontext } from '../../../../App'
import jwt_decode from 'jwt-decode';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';


const ManagerDash = () => {

  const [pending_order, setpending_order] = useState([])
  const [pending_payment, setpending_payment] = useState([])
  const [allorders, setallorders] = useState([])

  const PendingOrder = async () => {
    const res = await axios.get('https://caviar-api.vercel.app/api/order')
    setallorders(res.data)
    const recent_status = await res.data.filter((order) => order.status == 'انتظار')
    const recent_payment_status = await res.data.filter((order) => order.payment_status == 'انتظار')
    console.log({ recent_payment_status: recent_payment_status })
    setpending_order(recent_status)
    setpending_payment(recent_payment_status)
  }


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
      const order = axios.put('https://caviar-api.vercel.app/api/order/' + id, {
        payment_status
      })
      // setupdate(!update)
    } catch (error) {
      console.log(error)
    }
  }

  // ارسال ويتر 
  const [waiters, setwaiters] = useState([])
  const getAllWaiter = async () => {
    const allemployee = await axios.get('https://caviar-api.vercel.app/api/employee')
    console.log(allemployee)
    const allwaiter = await allemployee.data.filter((employee) => employee.role == 'waiter')
    console.log(allwaiter)
    const waiterActive = await allwaiter.filter((waiter) => waiter.isActive == true)
    console.log(waiterActive)
    const listId = []
    if (waiterActive) {
      waiterActive.forEach((waiter) => {
        listId.push(waiter._id)
      })
    }
    console.log(listId)
    if (listId.length > 0) {
      setwaiters(listId)
    }
  }

  // const [waiter, setwaiter] = useState()
  const specifiedWaiter = () => {
    const ordertakewaiter = allorders.filter((order) => order.waiter != null)
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

  const sendwaiter = async (id) => {
    const help = 'ارسال ويتر';
    const waiter = specifiedWaiter()
    const order = await axios.put('https://caviar-api.vercel.app/api/order/' + id, {
      waiter, help
    })
    PendingOrder()
    setupdate(!update)
    console.log(order.data)
  }

  const [cashRegister, setcashRegister] = useState('');
  const [cashRegistername, setcashRegistername] = useState('');
  const [balance, setbalance] = useState();
  const [createBy, setcreateBy] = useState('');


  const handelCashRegister = (id) => {
    const CashRegister = AllCashRegisters ? AllCashRegisters.find((cash => cash.employee == id)) : {}
    setcashRegister(CashRegister._id)
    setcashRegistername(CashRegister.name)
    setbalance(CashRegister.balance)
    console.log(CashRegister.balance)
    setcreateBy(id)
  }

  const [AllCashRegisters, setAllCashRegisters] = useState([]);
  // Fetch all cash registers
  const getAllCashRegisters = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/cashregister');
      setAllCashRegisters(response.data.reverse());
    } catch (err) {
      toast.error('Error fetching cash registers');
    }
  };


  const RevenueRecording = async (id, amount, description) => {
    // e.preventDefault();
    handelCashRegister(id)
    try {
      if (cashRegister) {
        const updatedBalance = balance + amount; // Calculate the updated balance


        const cashMovement = await axios.post('https://caviar-api.vercel.app/api/cashMovement/', {
          registerId: cashRegister,
          createBy,
          amount,
          type: 'Revenue',
          description,
        });
        console.log(cashMovement)
        console.log(cashMovement.data.cashMovement._id)

        // const cashMovementId = await cashMovement.data.cashMovement._id; // Retrieve the cashMovementId from the response data

        // const dailyexpense = await axios.post('https://caviar-api.vercel.app/api/dailyexpense/', {
        //   expenseID,
        //   expenseDescription,
        //   cashRegister,
        //   cashMovementId,
        //   paidBy,
        //   amount,
        //   notes,
        // });

        const updatecashRegister = await axios.put(`https://caviar-api.vercel.app/api/cashregister/${cashRegister}`, {
          balance: updatedBalance, // Use the updated balance
        });

        // Update the state after successful updates
        if (updatecashRegister) {
          setbalance(updatedBalance);
          // Toast notification for successful creation
          toast.success('Expense created successfully');

          getAllCashRegisters()
          setupdate(!update)
        }
      }
    } catch (error) {
      console.log(error);
      // Toast notification for error
      toast.error('Failed to create expense');

    }
  };

  const [userlogininfo, setuserlogininfo] = useState(null)
  const getUserInfoFromToken = () => {
    const employeetoken = localStorage.getItem('token_e');

    let decodedToken = null;

    if (employeetoken) {
      decodedToken = jwt_decode(employeetoken);
      console.log(decodedToken);
      setuserlogininfo(decodedToken.employeeinfo);
      console.log(decodedToken.employeeinfo);
      handelCashRegister(decodedToken.employeeinfo.id)
    } else {
      setuserlogininfo(null);
    }

    return decodedToken;
  };

  useEffect(() => {
    PendingOrder()
    getAllWaiter()
    getAllCashRegisters()
    getUserInfoFromToken()
  }, [update])

  return (
    <detacontext.Consumer>
      {
        ({ userlogininfo, usertitle, list_day_order, total_day_salse, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
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
                        {balance}
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
                                    onClick={() => { changePaymentorderstauts({ target: { value: 'تم الدفع' } }, recent._id); RevenueRecording(userlogininfo.id, recent.total, `${recent.serial} ${recent.table != null ? usertitle(recent.table) : usertitle(recent.user)}`) }}
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
                              {order.help == 'يطلب مساعدة' || order.help == 'يطلب الفاتورة' ? <button type="button" className="btn btn-primary" onClick={() => sendwaiter(order._id)}>ارسال ويتر</button> :
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