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
      if(done){
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
      if (done){
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
      if(done){
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
    if(products.length == cloneproduct.length){
      const status = 'Delivered'
      const done = await axios.put('https://caviar-api.vercel.app/api/order/' + id, {
        products,
        status
      })
      if(done){
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
        ({ usertitle, userLoginInfo }) => {
          return (
            <div className='Waiter'>

              {pending_payment.filter((order) => order.isActive == false || order.help == 'Send waiter' ||order.help == 'On the way').map((order, i) => {
                return (
                  <div className="wai-card" key={i}>
                    <div className="card-info">
                      <p className="info-p">اسم العميل {order.table != null ? usertitle(order.table) : usertitle(order.user)}</p>
                      <p className="info-p">رقم الطلب {order.serial}</p>
                      <p className="info-p">نوع الطلب {order.order_type}</p>
                      <p className="info-p">اسم الويتر {usertitle(order.waiter)}</p>
                      <p className="info-p">وقت الاستلام {new Date(order.createdAt).getHours() + ":" + new Date(order.createdAt).getMinutes()}</p>
                      <p className="info-p">وقت التنفيذ {new Date(order.updatedAt).getHours() + ":" + new Date(order.updatedAt).getMinutes()}</p>
                    </div>
                    <div className="card-product">
                      <ul className='card-ul'>
                        <li className="card-li">
                            <p className='product-name' >{order.table != null ? usertitle(order.table) : usertitle(order.user)}</p>
                            <p className='product-name' >{order.help!= 'Not requested' ? 'يحتاج المساعدة' : order.isActive == false ? 'يحتاج الفاتورة' : ''}</p>

                        </li>

                      </ul>
                    </div>
                    <div className='card-btn'>
                      {order.help == 'Send waiter' ?
                        <button ref={ready} className='btn-ready' onClick={() => { helpOnWay(order._id) }}>متجة للعميل</button>
                        :order.help == 'On the way' ? <button ref={start} className='btn-start' onClick={() => helpDone(order._id)}>تم</button>
                      :''}
                    </div>
                  </div>
                )
              })
              }

              {orderactive && orderactive.map((order, i) => {
                if (order.products.filter((pr) => pr.isDone == false).length > 0) {
                  return (
                    <div className="wai-card" key={i}>
                      <div className="card-info">
                        <p className="info-p">اسم العميل {order.table != null ? usertitle(order.table) : usertitle(order.user)}</p>
                        <p className="info-p">رقم الطلب {order.serial}</p>
                        <p className="info-p">نوع الطلب {order.order_type}</p>
                        <p className="info-p">اسم الويتر {usertitle(order.waiter)}</p>
                        <p className="info-p">وقت الاستلام {new Date(order.createdAt).getHours() + ":" + new Date(order.createdAt).getMinutes()}</p>
                        <p className="info-p">وقت التنفيذ {new Date(order.updatedAt).getHours() + ":" + new Date(order.updatedAt).getMinutes()}</p>
                      </div>
                      <div className="card-product">
                        <ul className='card-ul'>
                          {order.products.filter((pr) => pr.isDone == false) && order.products.filter((pr) => pr.isDone == false).map((product, i) => {
                            return (
                              <li className='card-li' key={i}>
                                <p className='product-name'>{i + 1}- {product.name}</p>
                                <span className='product-quantity'> × {product.quantity}</span>
                              </li>
                            )
                          })
                          }

                        </ul>
                      </div>
                      <div className='card-btn'>
                        {order.status == 'Prepared' ?
                          <button ref={ready} className='btn-ready' onClick={() => { orderOnWay(order._id) }}>استلام الاوردر</button>
                          : <button ref={start} className='btn-start' onClick={() => orderDelivered(order._id)}>تم التسليم</button>
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