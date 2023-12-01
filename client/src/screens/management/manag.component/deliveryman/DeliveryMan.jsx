import React, { useState, useEffect, useRef } from 'react'
import { detacontext } from '../../../../App'
// import './Waiter.css'
import axios from 'axios'


const DeliveryMan = () => {
  // State for pending orders and payments
  const [pendingOrders, setPendingOrders] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
 
  // Function to fetch pending orders and payments
  const fetchPendingData = async () => {
    try {
      const res = await axios.get('https://caviar-api.vercel.app/api/order');
      const recentStatus = res.data.filter((order) => order.status === 'Pending');
      const recentPaymentStatus = res.data.filter((order) => order.payment_status === 'Pending');
      setPendingOrders(recentStatus);
      setPendingPayments(recentPaymentStatus);
    } catch (error) {
      console.log(error);
    }
  };
 
  // State for internal orders
  const [deliveryOrders, setdeliveryOrders] = useState([]);
 
  // Function to fetch internal orders
  const fetchdeliveryOrders = async () => {
    try {
      const orders = await axios.get('https://caviar-api.vercel.app/api/order');
      const activeOrders = orders.data.filter((order) => order.isActive === true && (order.status === 'Prepared' || order.status === 'On the way'));
      const deliveryOrdersData = activeOrders.filter(order => order.order_type === 'Delivery');
      setdeliveryOrders(deliveryOrdersData);
    } catch (error) {
      console.log(error);
    }
  };
 
   const updateOrderOnWay = async (id) => {
     try {
       const status = 'On the way';
       await axios.put(`https://caviar-api.vercel.app/api/order/${id}`, { status });
       fetchdeliveryOrders();
       fetchPendingData();
       toast.success('Order is on the way!');
     } catch (error) {
       console.log(error);
       toast.error('Error updating order status!');
     }
   };
 
   const updateOrderDelivered = async (id) => {
     try {
       const orderData = await axios.get(`https://caviar-api.vercel.app/api/order/${id}`);
       const products = orderData.data.products.map((prod) => ({ ...prod, isDone: true }));
       const status = 'Delivered';
       await axios.put(`https://caviar-api.vercel.app/api/order/${id}`, { products, status });
       fetchdeliveryOrders();
       fetchPendingData();
       toast.success('Order has been delivered!');
     } catch (error) {
       console.log(error);
       toast.error('Error delivering order!');
     }
   };
 
 
  // Fetch initial data on component mount
   useEffect(() => {
     fetchPendingData();
     fetchdeliveryOrders();
   }, []);
 
   return (
     <detacontext.Consumer>
       {
         ({ usertitle, employeeLoginInfo }) => {
           return (
             <div className='container-fluid h-100 overflow-auto bg-transparent py-5 px-3'>
               <ToastContainer/>
 
               {deliveryOrders && deliveryOrders.map((order, i) => {
                 if (order.products.filter((pr) => pr.isDone == false).length > 0) {
                   return (
                     <div className="card text-white bg-success" style={{ width: "265px" }}>
                       <div className="card-body text-right d-flex justify-content-between p-0 m-1">
                         <div style={{ maxWidth: "50%" }}>
                           <p className="card-text">العميل: {usertitle(order.name)}</p>
                           <p className="card-text">رقم الفاتورة: {order.serial}</p>
                           <p className="card-text">العنوان: {order.address}</p>
                         </div>
                         <div style={{ maxWidth: "50%" }}>
                           <p className="card-text"> الطيار: {usertitle(order.deliveryMan)}</p>
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
                           <button className="btn btn-warning btn-lg" style={{ width: "100%" }} onClick={() => { updateOrderOnWay(order._id) }}>استلام الطلب</button>
                           : <button className="btn btn-success btn-lg" style={{ width: "100%" }} onClick={() =>{ updateOrderDelivered(order._id)}}>تم التسليم</button>
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

export default DeliveryMan