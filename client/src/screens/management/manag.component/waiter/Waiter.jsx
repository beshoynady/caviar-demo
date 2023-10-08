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
    const res = await axios.get('https://restaurant-api-blush.vercel.app/api/order')
    const recent_status = await res.data.filter((order) => order.status == 'انتظار')
    const recent_payment_status = await res.data.filter((order) => order.payment_status == 'انتظار')
    setpending_order(recent_status)
    setpending_payment(recent_payment_status)
  }


  const [orderactive, setorderactive] = useState([])
  const GetPrductstowaiter = async () => {
    try {
      const orders = await axios.get('https://restaurant-api-blush.vercel.app/api/order');
      // console.log(orders)
      const orderisctive = await orders.data.filter((order) => order.isActive == true && order.status == 'تم التحضير' || order.status == 'في الطريق')
      console.log(orderisctive)
      setorderactive(orderisctive)

    } catch (error) {
      console.log(error)
    }
  }

  const orderOnWay = async (id) => {
    // const waiter = waiterid;
    const status = 'في الطريق'
    const done = await axios.put('https://restaurant-api-blush.vercel.app/api/order/' + id, {
      status
    })
    GetPrductstowaiter()
    console.log(done)
  }
  const helpOnWay = async (id) => {
    const help = 'في الطريق'
    const done = await axios.put('https://restaurant-api-blush.vercel.app/api/order/' + id, {
      help
    })
    GetPrductstowaiter()
    console.log(done)
  }

  const helpDone = async (id) => {
    const help = 'تمت المساعدة'
    const done = await axios.put('https://restaurant-api-blush.vercel.app/api/order/' + id, {
      help
    })
    GetPrductstowaiter()
  }


  const orderDelivered = async (id) => {
    const order = await axios.get('https://restaurant-api-blush.vercel.app/api/order/' + id)
    // console.log(order)
    const cloneproduct = await order.data.products
    // console.log(cloneproduct)
    const products = []
    for (let i = 0; i < cloneproduct.length; i++) {
      cloneproduct[i].isDone = true;
      products.push(cloneproduct[i])
    }
    console.log(products)
    const status = 'تم التوصيل'
    const done = await axios.put('https://restaurant-api-blush.vercel.app/api/order/' + id, {
      products,
      status
    })
    GetPrductstowaiter()
  }



  useEffect(() => {
    PendingOrder()
    GetPrductstowaiter()
  }, [])

  return (
    <detacontext.Consumer>
      {
        ({ usertitle, userlogininfo }) => {
          return (
            <div className='Waiter'>

              {pending_payment.filter((order) => order.isActive == false || order.help == 'ارسال ويتر' ||order.help == 'في الطريق').map((order, i) => {
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
                            <p className='product-name' >{order.help!= 'لم يطلب' ? 'يحتاج المساعدة' : order.isActive == false ? 'يحتاج الفاتورة' : ''}</p>

                        </li>

                      </ul>
                    </div>
                    <div className='card-btn'>
                      {order.help == 'ارسال ويتر' ?
                        <button ref={ready} className='btn-ready' onClick={() => { helpOnWay(order._id) }}>متجة للعميل</button>
                        :order.help == 'في الطريق' ? <button ref={start} className='btn-start' onClick={() => helpDone(order._id)}>تم</button>
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
                        {order.status == 'تم التحضير' ?
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