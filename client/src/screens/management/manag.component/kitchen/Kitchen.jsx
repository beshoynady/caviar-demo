import { useState, useEffect, useRef } from 'react';
import './Kitchen.css'
import axios from 'axios';
import { detacontext } from '../../../../App'
import { toast, ToastContainer } from 'react-toastify'; // Importing toast from 'react-toastify' for notifications
import 'react-toastify/dist/ReactToastify.css'; // Importing default CSS for toast notifications

const Kitchen = () => {
  const start = useRef();
  const ready = useRef();

  const [orderactive, setOrderActive] = useState([]); // State for active orders
  const [allOrders, setAllOrders] = useState([]); // State for all orders
  const [waiters, setWaiters] = useState([]); // State for active waiters
  const [waittime, setWaitTime] = useState(''); // State for waiting time

  // Fetches orders from the API
  const getOrdersFromAPI = async () => {
    try {
      const orders = await axios.get('https://caviar-api.vercel.app/api/order');
      setAllOrders(orders.data);

      const activeOrders = orders.data.filter(
        (order) => order.isActive && (order.status === 'Approved' || order.status === 'Preparing')
      );
      setOrderActive(activeOrders);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetches all active waiters from the API
  const getAllWaiters = async () => {
    try {
      const allEmployees = await axios.get('https://caviar-api.vercel.app/api/employee');
      const allWaiters = allEmployees.data.filter((employee) => employee.role === 'waiter');
      const waiterActive = allWaiters.filter((waiter) => waiter.isActive);

      const waiterIds = waiterActive.map((waiter) => waiter._id);
      setWaiters(waiterIds);
    } catch (error) {
      console.log(error);
    }
  };

  // Determines the next available waiter to take an order
  const specifiedWaiter = () => {
    const orderTakeWaiter = allOrders.filter((order) => order.waiter !== null);
    const lastWaiter = orderTakeWaiter.length > 0 ? orderTakeWaiter[orderTakeWaiter.length - 1].waiter : '';

    const indexLastWaiter = lastWaiter ? waiters.indexOf(lastWaiter) : 0;

    if (waiters.length === indexLastWaiter + 1) {
      return waiters[0];
    } else {
      return waiters[indexLastWaiter + 1];
    }
  };

  // Updates an order status to 'Preparing'
  const orderInProgress = async (id) => {
    const waiter = specifiedWaiter();
    const status = 'Preparing';

    try {
      await axios.put(`https://caviar-api.vercel.app/api/order/${id}`, { status, waiter });
      getOrdersFromAPI();
      getAllWaiters();
      toast.success('Order is in progress!'); // Notifies success in starting order
    } catch (error) {
      console.log(error);
      toast.error('Failed to start order!'); // Notifies failure in starting order
    }
  };

  // Updates an order status to 'Prepared'
  const orderDone = async (id) => {
    const status = 'Prepared';

    try {
      await axios.put(`https://caviar-api.vercel.app/api/order/${id}`, { status });
      getOrdersFromAPI();
      toast.success('Order is prepared!'); // Notifies success in completing order
    } catch (error) {
      console.log(error);
      toast.error('Failed to complete order!'); // Notifies failure in completing order
    }
  };

  // Calculates the waiting time for an order
  const waitingTime = (t) => {
    const t1 = new Date(t).getTime();
    const t2 = new Date().getTime();
    const waitingTime = t2 - t1;

    const m = new Date(waitingTime).getMinutes();
    setWaitTime(m);

    setTimeout(() => waitingTime(t), 60000);
    return m;
  };

  // Fetches orders and active waiters on initial render
  useEffect(() => {
    getOrdersFromAPI();
    getAllWaiters();
  }, []);

  return (
    <detacontext.Consumer>
      {
        ({ usertitle, updatecountofsales }) => {
          return (
            <div className='container-fluid h-100 overflow-auto bg-transparent py-5 px-3'>
              <ToastContainer />
              {
                orderactive && orderactive.map((order, i) => {
                  if (order.products.filter((pr) => pr.isDone == false).length > 0) {
                    return (
                      <div className="card text-white bg-success" style={{ width: "265px" }}>
                        <div className="card-body text-right d-flex justify-content-between p-0 m-1">
                          <div style={{ maxWidth: "50%" }}>
                            <p className="card-text"> {order.table != null ? `طاولة: ${usertitle(order.table)}` : (order.user ? `العميل: ${usertitle(order.user)}` : '')}</p>
                            <p className="card-text">الفاتورة: {order.serial}</p>
                            <p className="card-text">نوع الطلب: {order.order_type}</p>
                          </div>

                          <div style={{ maxWidth: "50%" }}>
                            {order.waiter ? <p className="card-text">الويتر: {usertitle(order.waiter)}</p> : ""}
                            <p className="card-text">الاستلام: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p className="card-text">الانتظار: {waitingTime(order.createdAt)} دقيقه</p>
                          </div>
                        </div>

                        <ul className='list-group list-group-flush'>
                          {order.products.filter((pr) => pr.isDone === false).map((product, i) => (
                            <ul key={i} className={`list-group ${product.isAdd ? 'bg-red' : 'bg-light'}`}>
                              <li className={`list-group-item text-dark d-flex flex-column justify-content-between align-items-center ${product.isAdd ? 'bg-red' : 'bg-light'}`}>
                                <div className="d-flex justify-content-between align-items-center w-100">
                                  <span style={{ fontSize: "18px" }}>{i + 1}- {product.name}</span>
                                  <span className="badge bg-secondary rounded-pill" style={{ fontSize: "16px" }}> × {product.quantity}</span>
                                </div>
                                <div>{product.notes}</div>
                              </li>
                            </ul>
                          ))}
                        </ul>
                        <div className="card-footer text-center">
                          {order.status === 'Preparing' ?
                            <button className="btn btn-warning btn-lg" style={{ width: "100%" }} onClick={() => { orderDone(order._id); updatecountofsales(order._id) }}>تم التنفيذ</button>
                            : <button className="btn btn-success btn-lg" style={{ width: "100%" }} onClick={() => orderInProgress(order._id)}>بدء التنفيذ</button>
                          }
                        </div>
                      </div>
                    )
                  }

                })
              }
              )
            </div>
          )
        }
      }
    </detacontext.Consumer>
  )

}

export default Kitchen