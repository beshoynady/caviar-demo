import React, { useState, useEffect, useRef } from 'react'
import { detacontext } from '../../../../App'
import './Kitchen.css'
import axios from 'axios'



const Kitchen = () => {
  const start = useRef()
  const ready = useRef()


  const [orderactive, setorderactive] = useState([])
  const [allorders, setallorders] = useState([])
  const GetPrductstoKit = async () => {
    try {
      const orders = await axios.get('https://restaurant-api-blush.vercel.app/api/order');
      // console.log(orders.data)
      setallorders(orders.data)

      const orderisctive = await orders.data.filter((order) => order.isActive == true && order.status == 'موافق' || order.status == 'جاري التحضير')
      // console.log(orderisctive)
      setorderactive(orderisctive)
    } catch (error) {
      console.log(error)
    }
  }

  const [waiters, setwaiters] = useState([])
  const getAllWaiter = async () => {
    const alluser = await axios.get('https://restaurant-api-blush.vercel.app/api/user')
    console.log(alluser)
    const allwaiter = await alluser.data.filter((user) => user.role === 'waiter')
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
    const lastwaiter = ordertakewaiter.length>0? ordertakewaiter[allorders.length - 1].waiter : ''
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

  const orderInprogress = async (id) => {
    // await specifiedWaiter();
    const waiter = specifiedWaiter()
    const status = 'جاري التحضير'
    const order = await axios.put('https://restaurant-api-blush.vercel.app/api/order/' + id, {
      status,waiter
    })
    console.log(order.data)
    GetPrductstoKit()
    getAllWaiter()
  }


  const orderDone = async (id) => {
    const status = 'تم التحضير'
    const done = await axios.put('https://restaurant-api-blush.vercel.app/api/order/' + id, {
      status
    })
    GetPrductstoKit()
  }


  useEffect(() => {
    GetPrductstoKit()
    getAllWaiter()
    // specifiedWaiter()
    // console.log(waiters)
  }, [])

  return (
    <detacontext.Consumer>
      {
        ({ usertitle, updatecountofsales }) => {
          return (
            <div className='Kitchen'>
              {orderactive && orderactive.map((order, i) => {
                if (order.products.filter((pr) => pr.isDone == false).length > 0) {
                  return (
                    <div className="kit-card" key={i}>
                      <div className="card-info">
                        <p className="info-p">العميل:{order.table != null ? usertitle(order.table) : usertitle(order.user)}</p>
                        <p className="info-p">رقم الطلب {order.serial}</p>
                        <p className="info-p">نوع الطلب {order.order_type}</p>
                        <p className="info-p">الويتر {usertitle(order.waiter)}</p>
                        <p className="info-p">وقت الاستلام {new Date(order.createdAt).getHours()}:{new Date(order.createdAt).getMinutes()}</p>
                        <p className="info-p">وقت التنفيذ {new Date(order.createdAt).getHours()}:{new Date(order.createdAt).getMinutes()}</p>
                      </div>
                      <div className="card-product">
                        <ul className='card-ul'>
                          {order.products.filter((pr) => pr.isDone == false) && order.products.filter((pr) => pr.isDone == false).map((product, i) => {
                            return (
                              <li className='card-li' key={i}>
                                <div className='product-card-det'>
                                <p className='product-name'>{i + 1}- {product.name}</p>
                                <span className='product-quantity'> × {product.quantity}</span>
                                </div>
                                <div className='product-note'>{product.notes}</div>
                              </li>
                            )
                          })
                          }

                        </ul>
                      </div>
                      <div className='card-btn'>
                        {order.status == 'جاري التحضير' ? <button ref={ready} className='btn-ready' onClick={() => { orderDone(order._id); updatecountofsales(order._id) }}>تم التنفيذ</button>
                          : <button ref={start} className='btn-start' onClick={() => orderInprogress(order._id)}>بدء التنفيذ</button>

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

export default Kitchen