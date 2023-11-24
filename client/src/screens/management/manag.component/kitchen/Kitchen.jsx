import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import './Kitchen.css';
import axios from 'axios';

import { detacontext } from '../../../../App'



const Kitchen = () => {
  const start = useRef()
  const ready = useRef()


  const [orderactive, setorderactive] = useState([])
  const [allOrders, setallOrders] = useState([])
  const GetPrductstoKit = async () => {
    try {
      const orders = await axios.get('https://caviar-api.vercel.app/api/order');
      // console.log(orders.data)
      setallOrders(orders.data)

      const orderisctive = await orders.data.filter((order) => order.isActive == true && order.status == 'Approved' || order.status == 'Preparing')
      // console.log(orderisctive)
      setorderactive(orderisctive)
    } catch (error) {
      console.log(error)
    }
  }

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
    const ordertakewaiter = allOrders.filter((order) => order.waiter != null)
    console.log(ordertakewaiter)
    const lastwaiter = ordertakewaiter.length > 0 ? ordertakewaiter[ordertakewaiter.length - 1].waiter : ''
    // console.log(lastwaiter)

    const indexoflastwaiter = lastwaiter != '' ? waiters.indexOf(lastwaiter) : 0

    // console.log(indexoflastwaiter)
    // console.log(indexoflastwaiter + 1)
    // console.log(waiters.length)
    // console.log(waiters)
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
    const waiter = await specifiedWaiter()
    const status = 'Preparing'
    const order = await axios.put('https://caviar-api.vercel.app/api/order/' + id, {
      status, waiter
    })
    console.log(order.data)
    GetPrductstoKit()
    getAllWaiter()
  }


  const orderDone = async (id) => {
    const status = 'Prepared'
    const done = await axios.put('https://caviar-api.vercel.app/api/order/' + id, {
      status
    })
    GetPrductstoKit()
  }

  const [waittime, setwaittime] = useState('')
  const Waitingtime = (t) => {
    const t1 = new Date(t).getTime()
    const t2 = new Date().getTime()
    const Waiting_time = t2 - t1
    // console.log(Waiting_time)
    const m = new Date(Waiting_time).getMinutes()
    // const s = new Date(Waiting_time).getSeconds()
    // const Waiting_time_m_s = `${m}:${s}`
    // console.log(Waiting_time_m_s)
    // setwaittime(Waiting_time_m_s)
    setwaittime(m)
    setTimeout(Waitingtime, 60000)
    // return Waiting_time_m_s
    return m
  }


  // useEffect(() => {
  //   GetPrductstoKit()
  // }, [waittime])

  useEffect(() => {
    GetPrductstoKit()
    getAllWaiter()
    // specifiedWaiter()
    // console.log(waiters)
  }, [])

  return (
    <detacontext.Consumer>
      {({ usertitle, updatecountofsales }) => {
        return (
          <Container>
            {orderactive &&
              orderactive.map((order, i) => {
                if (
                  order.products.filter((pr) => pr.isDone === false).length > 0
                ) {
                  return (
                    <Row key={i} className="kit-card">
                      <Col>
                        <div className="card-info">
                          {/* ... الكود الحالي ... */}
                        </div>
                      </Col>
                      <Col>
                        <div className="card-product">
                          <ul className="list-group">
                            {order.products
                              .filter((pr) => pr.isDone === false)
                              .map((product, j) => {
                                return (
                                  <li
                                    key={j}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                    style={{
                                      backgroundColor: product.isAdd
                                        ? 'red'
                                        : 'inherit',
                                    }}
                                  >
                                    <div className="product-card-det">
                                      <span className="badge rounded-pill bg-primary">
                                        {j + 1}
                                      </span>
                                      <span className="product-name">
                                        {product.name}
                                      </span>
                                      <span className="product-quantity">
                                        × {product.quantity}
                                      </span>
                                    </div>
                                    <div className="product-note">
                                      {product.notes}
                                    </div>
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      </Col>
                      <Col>
                        <div className="card-btn">
                          {order.status === 'Preparing' ? (
                            <Button
                              ref={ready}
                              className="btn btn-success"
                              onClick={() => {
                                orderDone(order._id);
                                updatecountofsales(order._id);
                              }}
                            >
                              تم التنفيذ
                            </Button>
                          ) : (
                            <Button
                              ref={start}
                              className="btn btn-danger"
                              onClick={() => orderInprogress(order._id)}
                            >
                              بدء التنفيذ
                            </Button>
                          )}
                        </div>
                      </Col>
                    </Row>
                  );
                }
              })}
          </Container>
        );
      }}
    </detacontext.Consumer>
  );
};

export default Kitchen;