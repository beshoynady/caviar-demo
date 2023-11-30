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


  const [orderactive, setorderactive] = useState([])
  const GetPrductstowaiter = async () => {
    try {
      const orders = await axios.get('https://caviar-api.vercel.app/api/order');
      // console.log(orders)
      const orderisctive = await orders.data.filter((order) => order.isActive == true && order.status == 'Prepared' || order.status == 'On the way')
      console.log(orderisctive)
      setorderactive(orderisctive)

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
                  <div className="card mb-3" style={{ maxWidth: "500px" }}>
                    <div className="card-header bg-success text-white">
                      <h5 className="card-title mb-0">تفاصيل الطلب</h5>
                    </div>
                    <div className="card-body">
                      <p className="card-text text-dark"><strong>اسم العميل:</strong> {order.table != null ? usertitle(order.table) : usertitle(order.user)}</p>
                      <p className="card-text text-dark"><strong>رقم الطلب:</strong> {order.serial}</p>
                      <p className="card-text text-dark"><strong>نوع الطلب:</strong> {order.order_type}</p>
                      <p className="card-text text-dark"><strong>اسم الويتر:</strong> {usertitle(order.waiter)}</p>
                      <p className="card-text text-dark"><strong>وقت الاستلام:</strong> {new Date(order.createdAt).toLocaleTimeString()}</p>
                      <p className="card-text text-dark"><strong>وقت التنفيذ:</strong> {new Date(order.updatedAt).toLocaleTimeString()}</p>
                    </div>
                    <ul className="list-group list-group-flush">
                      {order.products.filter((pr) => pr.isDone === false).map((product, i) => {
                        return (
                          <li className="list-group-item d-flex justify-content-between align-items-center bg-white text-dark" key={i}>
                            <span>{i + 1}- {product.name}</span>
                            <span className="badge bg-secondary rounded-pill"> × {product.quantity}</span>
                          </li>
                        )
                      })}
                    </ul>
                    <div className="card-footer text-center">
                      {order.status === 'Prepared' ?
                        <button className="btn btn-warning" onClick={() => { orderOnWay(order._id) }}>استلام الطلب</button>
                        : <button className="btn btn-success" onClick={() => orderDelivered(order._id)}>تم التسليم</button>
                      }
                    </div>
                  </div>

                )
              })
              }

              {orderactive && orderactive.map((order, i) => {
                if (order.products.filter((pr) => pr.isDone == false).length > 0) {
                  return (
                    <div className="card mb-3" key={i}>
                      <div className="card-body">
                        <p className="card-text">اسم العميل {order.table != null ? usertitle(order.table) : usertitle(order.user)}</p>
                        <p className="card-text">رقم الطلب {order.serial}</p>
                        <p className="card-text">نوع الطلب {order.order_type}</p>
                        <p className="card-text">اسم الويتر {usertitle(order.waiter)}</p>
                        <p className="card-text">وقت الاستلام {new Date(order.createdAt).getHours() + ":" + new Date(order.createdAt).getMinutes()}</p>
                        <p className="card-text">وقت التنفيذ {new Date(order.updatedAt).getHours() + ":" + new Date(order.updatedAt).getMinutes()}</p>
                      </div>
                      <ul className="list-group list-group-flush">
                        {order.products.filter((pr) => pr.isDone === false).map((product, i) => {
                          return (
                            <li className="list-group-item" key={i}>
                              <p>{i + 1}- {product.name}</p>
                              <span> × {product.quantity}</span>
                            </li>
                          )
                        })}
                      </ul>
                      <div className="card-body">
                        {order.status === 'Prepared' ?
                          <button className="btn btn-primary" onClick={() => { orderOnWay(order._id) }}>استلام الاوردر</button>
                          : <button className="btn btn-success" onClick={() => orderDelivered(order._id)}>تم التسليم</button>
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