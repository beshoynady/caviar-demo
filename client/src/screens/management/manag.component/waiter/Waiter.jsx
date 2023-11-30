import React, { useState, useEffect, useRef } from 'react'
import { detacontext } from '../../../../App'
import './Waiter.css'
import axios from 'axios'


const Waiter = () => {
  const start = useRef()
  const ready = useRef()

  const [pending_order, setpending_order] = useState([])
  const [pending_payment, setpending_payment] = useState([])
  const PendingOrder = async () => {
    const res = await axios.get('https://caviar-api.vercel.app/api/order')
    const recent_status = await res.data.filter((order) => order.status == 'Pending')
    const recent_payment_status = await res.data.filter((order) => order.payment_status == 'Pending')
    setpending_order(recent_status)
    setpending_payment(recent_payment_status)
  }


  const [listInternalOrder, setlistInternalOrder] = useState([])
  const GetPrductstowaiter = async () => {
    try {
      const orders = await axios.get('https://caviar-api.vercel.app/api/order');
      // console.log(orders)
      const orderisctive = await orders.data.filter((order) => order.isActive == true && order.status == 'Prepared' || order.status == 'On the way')
      const internalOrder = orderisctive.filter(order=> order.order_type == 'Internal')
      console.log(orderisctive)
      setlistInternalOrder(internalOrder)

    } catch (error) {
      console.log(error)
    }
  }

  const orderOnWay = async (id) => {
    // const waiter = waiterid;
    try {
      const status = 'On the way'
      const done = await axios.put('https://caviar-api.vercel.app/api/order/' + id, {
        status
      })
      if (done) {
        GetPrductstowaiter()
        PendingOrder()
      }

    } catch (error) {
      console.log(error)
    }
  }
  const helpOnWay = async (id) => {
    try {
      const help = 'On the way'
      const done = await axios.put('https://caviar-api.vercel.app/api/order/' + id, {
        help
      })
      if (done) {
        console.log(done)
        GetPrductstowaiter()
        PendingOrder()
      }

    } catch (error) {
      console.log(error.message)
    }
  }

  const helpDone = async (id) => {
    try {
      const help = 'Assistance done'
      const done = await axios.put('https://caviar-api.vercel.app/api/order/' + id, {
        help
      })
      if (done) {
        PendingOrder()
        GetPrductstowaiter()
      }

    } catch (error) {
      console.log(error)
    }
  }


  const orderDelivered = async (id) => {
    const order = await axios.get('https://caviar-api.vercel.app/api/order/' + id)
    // console.log(order)
    const cloneproduct = await order.data.products
    // console.log(cloneproduct)
    const products = []
    for (let i = 0; i < cloneproduct.length; i++) {
      cloneproduct[i].isDone = true;
      products.push(cloneproduct[i])
    }
    console.log(products)
    if (products.length == cloneproduct.length) {
      const status = 'Delivered'
      const done = await axios.put('https://caviar-api.vercel.app/api/order/' + id, {
        products,
        status
      })
      if (done) {
        GetPrductstowaiter()
        PendingOrder()
      }
    }
  }



  useEffect(() => {
    PendingOrder()
    GetPrductstowaiter()
  }, [])

  return (
    <detacontext.Consumer>
      {
        ({ usertitle, employeeLoginInfo }) => {
          return (
            <div className='Waiter'>

              {pending_payment.filter((order) => order.isActive == false || order.help == 'Send waiter' || order.help == 'On the way').map((order, i) => {
                return (
                  <div className="card text-white bg-success" style={{ maxWidth: "300px" }}>
                  <div className="card-body text-right d-flex justify-content-between">
                    <div style={{ maxWidth: "50%" }}>
                      <p className="card-text">الطاولة: {usertitle(order.table)}</p>
                      <p className="card-text">رقم الفاتورة: {order.serial}</p>
                      <p className="card-text">نوع الطلب: {order.order_type}</p>
                    </div>
                    <div style={{ maxWidth: "50%" }}>
                      <p className="card-text">اسم الويتر: {usertitle(order.waiter)}</p>
                      <p className="card-text">الاستلام: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="card-text">التنفيذ: {new Date(order.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <ul className="list-group list-group-flush">
                    {order.products.filter((pr) => pr.isDone === false).map((product, i) => {
                      return (
                        <li className="list-group-item bg-light text-dark d-flex justify-content-between align-items-center" key={i}>
                          <span style={{ fontSize: "18px" }}>{i + 1}- {usertitle(order.table)}</span>
                          <span className="badge bg-secondary rounded-pill" style={{ fontSize: "16px" }}>{order.help == 'Requests assistance' ? 'يحتاج المساعدة' : order.help == 'Requests bill' ? 'يحتاج الفاتورة' : ''}</span>
                        </li>
                      )
                    })}
                  </ul>
                  <div className="card-footer text-center">
                    {order.status === 'Prepared' ?
                      <button className="btn btn-warning btn-lg" style={{ width: "100%" }} onClick={() => { helpOnWay(order._id) }}>متجة للعميل</button>
                      : <button className="btn btn-success btn-lg" style={{ width: "100%" }} onClick={() => helpDone(order._id)}>تم</button>
                    }
                  </div>
                </div>
                  // <div className="wai-card" key={i}>
                  //   <div className="card-info">
                  //     <p className="info-p">اسم العميل {order.table != null ? usertitle(order.table) : usertitle(order.user)}</p>
                  //     <p className="info-p">رقم الطلب {order.serial}</p>
                  //     <p className="info-p">نوع الطلب {order.order_type}</p>
                  //     <p className="info-p">اسم الويتر {usertitle(order.waiter)}</p>
                  //     <p className="info-p">وقت الاستلام {new Date(order.createdAt).getHours() + ":" + new Date(order.createdAt).getMinutes()}</p>
                  //     <p className="info-p">وقت التنفيذ {new Date(order.updatedAt).getHours() + ":" + new Date(order.updatedAt).getMinutes()}</p>
                  //   </div>
                  //   <div className="card-product">
                  //     <ul className='card-ul'>
                  //       <li className="card-li">
                  //         <p className='product-name' >{order.table != null ? usertitle(order.table) : usertitle(order.user)}</p>
                  //         <p className='product-name' >{order.help != 'Not requested' ? 'يحتاج المساعدة' : order.isActive == false ? 'يحتاج الفاتورة' : ''}</p>

                  //       </li>

                  //     </ul>
                  //   </div>
                  //   <div className='card-btn'>
                  //     {order.help == 'Send waiter' ?
                  //       <button ref={ready} className='btn-ready' onClick={() => { helpOnWay(order._id) }}>متجة للعميل</button>
                  //       : order.help == 'On the way' ? <button ref={start} className='btn-start' onClick={() => helpDone(order._id)}>تم</button>
                  //         : ''}
                  //   </div>
                  // </div>
                )
              })
              }

              {listInternalOrder && listInternalOrder.map((order, i) => {
                if (order.products.filter((pr) => pr.isDone == false).length > 0) {
                  return (
                    <div className="card text-white bg-success" style={{ maxWidth: "300px" }}>
                      <div className="card-body text-right d-flex justify-content-between">
                        <div style={{ maxWidth: "50%" }}>
                          <p className="card-text">الطاولة: {usertitle(order.table)}</p>
                          <p className="card-text">رقم الفاتورة: {order.serial}</p>
                          <p className="card-text">نوع الطلب: {order.order_type}</p>
                        </div>
                        <div style={{ maxWidth: "50%" }}>
                          <p className="card-text">اسم الويتر: {usertitle(order.waiter)}</p>
                          <p className="card-text">الاستلام: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          <p className="card-text">التنفيذ: {new Date(order.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                      <ul className="list-group list-group-flush">
                        {order.products.filter((pr) => pr.isDone === false).map((product, i) => {
                          return (
                            <li className="list-group-item bg-light text-dark d-flex justify-content-between align-items-center" key={i}>
                              <span style={{ fontSize: "18px" }}>{i + 1}- {product.name}</span>
                              <span className="badge bg-secondary rounded-pill" style={{ fontSize: "16px" }}>× {product.quantity}</span>
                            </li>
                          )
                        })}
                      </ul>
                      <div className="card-footer text-center">
                        {order.status === 'Prepared' ?
                          <button className="btn btn-warning btn-lg" style={{ width: "100%" }} onClick={() => { orderOnWay(order._id) }}>استلام الطلب</button>
                          : <button className="btn btn-success btn-lg" style={{ width: "100%" }} onClick={() => orderDelivered(order._id)}>تم التسليم</button>
                        }
                      </div>
                    </div>

                  )
                }

              })}
            </div>
          )
        }
      }
    </detacontext.Consumer>
  )

}

export default Waiter