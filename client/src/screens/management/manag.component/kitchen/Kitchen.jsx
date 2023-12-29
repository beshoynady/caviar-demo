import { useState, useEffect, useRef } from 'react';
// import './Kitchen.css'
import axios from 'axios';
import { detacontext } from '../../../../App'
import { toast, ToastContainer } from 'react-toastify'; // Importing toast from 'react-toastify' for notifications
import 'react-toastify/dist/ReactToastify.css'; // Importing default CSS for toast notifications

const Kitchen = () => {
  const start = useRef();
  const ready = useRef();

  const [orderactive, setOrderActive] = useState([]); // State for active orders
  const [allOrders, setAllOrders] = useState([]); // State for all orders
  const [AllWaiters, setAllWaiters] = useState([]); // State for active waiters
  const [waiters, setWaiters] = useState([]); // State for active waiters ID
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
      setAllWaiters(waiterActive);

      const waiterIds = waiterActive.map((waiter) => waiter._id);
      setWaiters(waiterIds);
    } catch (error) {
      console.log(error);
    }
  };

  // Determines the next available waiter to take an order
  const specifiedWaiter = async (id) => {
    const getorder = allOrders.find((order) => order._id == id);
    console.log({ getorder: getorder });

    const tableId = getorder.table;
    console.log({ tableId: tableId });

    try {
      const getTable = await axios.get(`https://caviar-api.vercel.app/api/table/${tableId}`);
      console.log({ getTable: getTable });

      const tablesectionNumber = getTable.data.sectionNumber;
      console.log({ tablesectionNumber: tablesectionNumber });

      console.log({ AllWaiters: AllWaiters });

      const findwaiter = AllWaiters.find((waiter) => waiter.sectionNumber == tablesectionNumber);
      console.log({ findwaiter: findwaiter });

      const waiterId = findwaiter ? findwaiter._id : '';
      console.log({ waiterId: waiterId });

      return waiterId;
    } catch (error) {
      console.error('Error fetching table or waiter data:', error);
      return ''; // Handle the error case here, returning an empty string for waiterId
    }
  };

  // const specifiedWaiter = () => {
  //   const orderTakeWaiter = allOrders.filter((order) => order.waiter !== null);
  //   const lastWaiter = orderTakeWaiter.length > 0 ? orderTakeWaiter[orderTakeWaiter.length - 1].waiter : '';

  //   const indexLastWaiter = lastWaiter ? waiters.indexOf(lastWaiter) : 0;

  //   if (waiters.length === indexLastWaiter + 1) {
  //     return waiters[0];
  //   } else {
  //     return waiters[indexLastWaiter + 1];
  //   }
  // };



  // Updates an order status to 'Preparing'
  const orderInProgress = async (id, type) => {
    try {
      const status = 'Preparing';
      let waiter = '';

      if (type === 'Internal') {
        waiter = await specifiedWaiter(id);
      }
      const orderData = { status };
      if (waiter) {
        orderData.waiter = waiter;
      }

      const response = await axios.put(`https://caviar-api.vercel.app/api/order/${id}`, orderData);
      if (response.status === 200) {
        getOrdersFromAPI()
        toast.success('Order is in progress!');
      } else {
        toast.error('Failed to start order!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to start order!');
    }
  };

  const [listofProducts, setlistofProducts] = useState([]);

  const getallproducts = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/product/');
      const products = await response.data;
      // console.log(response.data)
      setlistofProducts(products)
      // console.log(listofProducts)

    } catch (error) {
      console.log(error)
    }

  }

  const [Allkitchenconsumption, setkitchenconsumption] = useState([]);

  const getkitchenconsumption = async () => {
    try {
      console.log('getkitchenconsumption');
      const response = await axios.get('https://caviar-api.vercel.app/api/kitchenconsumption');
      if (response) {
        setkitchenconsumption(response.data.data);
        console.log(response.data);
      } else {
        console.log('Unexpected status code:', response.status);
        // Handle other statuses if needed
      }
    } catch (error) {
      console.error('Error fetching kitchen consumption:', error);
      // Handle error: Notify user, log error, etc.
    }
  };
  // Updates an order status to 'Prepared'
  const orderDone = async (id) => {
    const status = 'Prepared';

    try {
      const orderData = await axios.get(`https://caviar-api.vercel.app/api/order/${id}`);
      // const products = orderData.data.products.map((prod) => ({ ...prod, isDone: true }));
      // await axios.put(`https://caviar-api.vercel.app/api/order/${id}`, { products, status });
      console.log({ Allkitchenconsumption: Allkitchenconsumption })
      const products = orderData.data.products;

      products.forEach((product) => {
        const { quantity, productid: productId } = product;
        console.log({ productquantity: quantity });
        console.log({ productid: productId });

        const foundProduct = listofProducts.find((p) => p._id === productId);
        const recipe = foundProduct ? foundProduct.Recipe : [];

        console.log({ recipe });

        recipe.forEach((rec) => {
          const kitconsumption = Allkitchenconsumption.find((kitItem) => kitItem.stockItemId === rec.itemId);

          if (kitconsumption) {
            console.log({ recitemId: rec.itemId });
            console.log({ stockItemId: kitconsumption.stockItemId });
            console.log({ kitItemid: kitconsumption._id });
            console.log({ consumptionQuantity: kitconsumption.consumptionQuantity });
            console.log({ recamount: rec.amount });
            console.log({ productquantity: quantity });

            const consumptionQuantity = kitconsumption.consumptionQuantity + rec.amount * quantity;
            const balance = kitconsumption.quantityTransferredToKitchen - consumptionQuantity;

            console.log({ consumptionQuantity });
            console.log({ balance });
            try {
              const update = axios.put(`https://caviar-api.vercel.app/api/kitchenconsumption/${kitconsumption._id}`, {
                consumptionQuantity,
                balance,
              });
              console.log({ update: update })

            } catch (error) {

              console.log({ error: error })
            }



            // Allkitchenconsumption.map((kitItem, i) => {
            //   console.log({ kitItem: kitItem })
            //   recipe.map((rec) => {
            //     console.log({ rec: rec })
            //     if (rec.itemId == kitItem.stockItemId) {
            //       console.log({ stockItemId: kitItem.stockItemId })
            //       console.log({ recitemId: rec.itemId })
            //       console.log({ kitItemid: kitItem._id })
            //       const consumptionQuantity = kitItem.consumptionQuantity + (rec.amount * product.quantity);
            //       const balance = kitItem.quantityTransferredToKitchen - consumptionQuantity;
            //       console.log({ consumptionQuantity: consumptionQuantity })
            //       console.log({ balance: balance })
            //       try {
            //         const update = axios.put(`https://caviar-api.vercel.app/api/kitchenconsumption/${kitItem._id}`, {
            //           consumptionQuantity,
            //           balance,
            //         });

            //       } catch (error) {

            //         console.log({error:error})
            //       }

            //     }
            //   })
            // })
          }
        })
      });

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
    getallproducts()
    getkitchenconsumption()
  }, []);

  return (
    <detacontext.Consumer>
      {
        ({ usertitle, updatecountofsales }) => {
          return (
            <div className="container-fluid d-flex flex-wrap align-content-start justify-content-around align-items-start h-100 overflow-auto bg-transparent py-5 px-3">
              <ToastContainer />
              {orderactive && orderactive.map((order, i) => {
                if (order.products.filter((pr) => pr.isDone === false).length > 0) {
                  return (
                    <div className="card text-white bg-success" style={{ width: "265px" }}>
                      <div className="card-body text-right d-flex justify-content-between p-0 m-1">
                        <div style={{ maxWidth: "50%" }}>
                          <p className="card-text"> {order.table != null ? `طاولة: ${usertitle(order.table)}` : (order.user ? `العميل: ${usertitle(order.user)}` : '')}</p>
                          <p className="card-text">رقم الطلب: {order.ordernum ? order.ordernum : ''}</p>
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
                        {order.products.filter((pr) => pr.isDone === false).map((product, i) => {
                          return (
                            <li className='list-group-item d-flex justify-content-between align-items-center' key={i} style={product.isAdd ? { backgroundColor: 'red', color: 'white' } : { color: 'black' }}>
                              <div className="d-flex justify-content-between align-items-center w-100">
                                <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{i + 1}- {product.name}</p>
                                <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}> × {product.quantity}</span>
                              </div>
                              <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{product.notes}</div>
                            </li>

                          )
                        })}
                      </ul>
                      <div className="card-footer text-center">
                        {order.status === 'Preparing' ?
                          <button className="btn btn-warning btn-lg" style={{ width: "100%" }} onClick={() => {
                            orderDone(order._id);
                            // updatecountofsales(order._id) 
                          }}>تم التنفيذ</button>
                          : <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={() => orderInProgress(order._id, order.order_type)}>بدء التنفيذ</button>
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