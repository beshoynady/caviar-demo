import React, { useState, useEffect } from 'react'
import './ManagerDash.css'
import { detacontext } from '../../../../App'
import axios from 'axios'

const ManagerDash = () => {
  const [pagination, setpagination] = useState(5)
  const EditPagination = (e) => {
    if (e.target.innerHTML == 'Next') {
      setpagination(pagination + 5)
    } else if (e.target.innerHTML == 'Previous') {
      if (pagination <= 5) {
        setpagination(5)
      } else {
        setpagination(pagination - 5)
      }
    } else {
      setpagination(e.target.innerHTML * 5)
    }
  }


  const [pending_order, setpending_order] = useState([])
  const [pending_payment, setpending_payment] = useState([])
  const [allorders, setallorders] = useState([])

  const PendingOrder = async () => {
    const res = await axios.get('https://restaurant-api-blush.vercel.app/api/order')
    setallorders(res.data)
    const recent_status = await res.data.filter((order) => order.status == 'انتظار')
    const recent_payment_status = await res.data.filter((order) => order.payment_status == 'انتظار')
    setpending_order(recent_status)
    setpending_payment(recent_payment_status)
  }


  const status = ['انتظار', 'موافق', 'ملغي']
  const [update, setupdate] = useState(false)

  const changeorderstauts = async (e, id) => {
    try {
      const status = await e.target.value
      const order = await axios.put('https://restaurant-api-blush.vercel.app/api/order/' + id, {
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
      const order = axios.put('https://restaurant-api-blush.vercel.app/api/order/' + id, {
        payment_status
      })
      setupdate(!update)
    } catch (error) {
      console.log(error)
    }
  }

  // ارسال ويتر 
  const [waiters, setwaiters] = useState([])
  const getAllWaiter = async () => {
    const alluser = await axios.get('https://restaurant-api-blush.vercel.app/api/user')
    console.log(alluser)
    const allwaiter = await alluser.data.filter((user) => user.role == 'waiter')
    console.log(allwaiter)
    const waiterActive = await allwaiter.filter((waiter)=> waiter.isActive == true)
    console.log(waiterActive)
    const listId = []
    if(waiterActive){
    waiterActive.forEach((waiter) => {
      listId.push(waiter._id)
    })}
    console.log(listId)
    if (listId.length > 0) {
      setwaiters(listId)
    }
  }

  // const [waiter, setwaiter] = useState()
  const specifiedWaiter = () => {
    const ordertakewaiter = allorders.filter((order)=> order.waiter != null)
    console.log(ordertakewaiter)
    const lastwaiter = ordertakewaiter.length>0 ? ordertakewaiter[allorders.length - 1].waiter : ''
    console.log(lastwaiter)

    const indexoflastwaiter = lastwaiter!=''? waiters.indexOf(lastwaiter): 0

    console.log(indexoflastwaiter)
    console.log(indexoflastwaiter + 1)
    console.log(waiters.length)
    console.log(waiters)
    // setwaiter(waiters[indexofwaiter+1])
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
    const order = await axios.put('https://restaurant-api-blush.vercel.app/api/order/' + id, {
      waiter, help
    })
    PendingOrder()
    setupdate(!update)
    console.log(order.data)
  }


  useEffect(() => {
    PendingOrder()
    getAllWaiter()

  }, [update])

  return (
    <detacontext.Consumer>
      {
        ({ usertitle, list_day_order, total_day_salse }) => {
          return (
            <section className='dashboard'>
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
                    <p>اجمالي الخزينه اليوم</p>
                    <h3>
                      {total_day_salse}
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
                      {pending_payment.map((recent, i) => {
                        if (i < pagination & i >= pagination - 5) {
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
                                <select name="status" id="status" form="carform" onChange={(e) => { changePaymentorderstauts(e, recent._id) }}>
                                  {paymentstatus.map((state, i) => {
                                    return <option value={state} key={i}>{state}</option>
                                  })
                                  }
                                </select>
                              </td>
                              <td>{recent.order_type}</td>
                            </tr>
                          )
                        }
                      })}
                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text">Showing <b>{pending_payment.length > pagination ? pagination : pending_payment.length}</b> out of <b>{pending_payment.length}</b> entries</div>
                    <ul className="pagination">
                      <li onClick={EditPagination} className="page-item disabled"><a href="#">Previous</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">1</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">2</a></li>
                      <li onClick={EditPagination} className="page-item active"><a href="#" className="page-link">3</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">4</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">5</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">Next</a></li>
                    </ul>
                  </div>
                </div>

                <div className="reminders">
                  <div className="header">
                    <i className='bx bx-note'></i>
                    <h3>متابعه العميل</h3>
                    <i className='bx bx-filter'></i>
                    <i className='bx bx-plus'></i>
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
                            {/* <p>{order.table != null ? order.help : order.isActive == false? 'يحتاج الفاتورة': ''}</p> */}
                          </div>
                          <i className='bx bx-dots-vertical-rounded'></i>
                        </li>
                      )

                    })}

                  </ul>
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