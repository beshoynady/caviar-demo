import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Userscreen from './screens/user.screen/Userscreen';
import ManagLayout from './screens/management/ManagLayout';
import ManagerDash from './screens/management/manag.component/managerdash/ManagerDash';
import Orders from './screens/management/manag.component/orders/Orders';
import Products from './screens/management/manag.component/products/Products';
import Tables from './screens/management/manag.component/tables/Tables';
import Employees from './screens/management/manag.component/employees/Employees';
import Category from './screens/management/manag.component/category/Category';
import CategoryStock from './screens/management/manag.component/stock/CategoryStock';
import Kitchen from './screens/management/manag.component/kitchen/Kitchen';
import Waiter from './screens/management/manag.component/waiter/Waiter';
import Login from './screens/management/manag.component/login/Login';
import POS from './screens/management/manag.component/pos/POS';
import StockItem from './screens/management/manag.component/stock/StockItem';
import StockManag from './screens/management/manag.component/stock/StockManag';
import ProductRecipe from './screens/management/manag.component/products/ProductRecipe';
import EmployeesSalary from './screens/management/manag.component/employees/EmployeesSalary';
import PayRoll from './screens/management/manag.component/employees/PayRoll';
import ExpenseItem from './screens/management/manag.component/expenses/Expense';
import DailyExpense from './screens/management/manag.component/expenses/dailyExpense';
import CashRegister from './screens/management/manag.component/cash/CashRegister';
import CashMovement from './screens/management/manag.component/cash/CashMovement';

export const detacontext = createContext({});

function App() {
  //++++++++++++++++++++ pagination ++++++++++

  const [startpagination, setstartpagination] = useState(0)
  const [endpagination, setendpagination] = useState(5)

  // const [pagination, setpagination] = useState(5)
  const EditPagination = (e) => {
    if (e.target.innerHTML == 'التالي') {
      setstartpagination(startpagination + 5)
      setendpagination(endpagination + 5)
    } else if (e.target.innerHTML == 'السابق') {
      if (endpagination <= 5) {
        setstartpagination(0)
        setendpagination(5)
      } else {
        setstartpagination(startpagination - 5)
        setendpagination(endpagination - 5)
      }
    } else {
      setstartpagination((e.target.innerHTML * 5) - 5)
      setendpagination(e.target.innerHTML * 5)

    }
  }

  const showdate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (`0${currentDate.getMonth() + 1}`).slice(-2);
    const day = (`0${currentDate.getDate()}`).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }

  //+++++++++++++++++ product ++++++++++++++++++++
  const [allProducts, setallProducts] = useState([])
  const getProducts = async () => {
    const products = await axios.get('https://caviar-api.vercel.app/api/product')
    setallProducts(products.data)
  }

  //+++++++ category +++++++++++
  const [allcategories, setallcategories] = useState([])
  const getCategories = async () => {
    try {
      const allcategories = await axios.get('https://caviar-api.vercel.app/api/category')
      setallcategories(allcategories.data)
    } catch (error) {
      console.log(error)
    }
  }
  const calcTotalSalesOfCategory = (id) => {
    var totalsalesofcategory = 0
    const productofcategory = allProducts.filter((pro) => pro.category == id)
    // console.log(productofcategory.map((product)=>product.sales))
    for (let i = 0; i < productofcategory.length; i++) {
      totalsalesofcategory = productofcategory[i].sales + totalsalesofcategory
    }
    // console.log(totalsalesofcategory)
    return totalsalesofcategory
  }
  // ++++++++++ order ++++++++++++
  const [allOrders, setallOrders] = useState([])
  const getallOrders = async () => {
    const orders = await axios.get('https://caviar-api.vercel.app/api/order');
    setallOrders(orders.data)
  }



  //+++++++++++ table ++++++++++++++
  const [allTable, setallTable] = useState([])
  const getallTable = async () => {
    const tables = await axios.get('https://caviar-api.vercel.app/api/table');
    setallTable(tables.data)
  }


  // +++++++++++++++ user +++++++++++++
  const [allUsers, setallUsers] = useState([])
  const getallUsers = async () => {
    const users = await axios.get('https://caviar-api.vercel.app/api/user');
    setallUsers(users.data)
  }
  const [allemployees, setallemployees] = useState([])
  const getallemployees = async () => {
    const employees = await axios.get('https://caviar-api.vercel.app/api/employee');
    setallemployees(employees.data)
  }



  // ++++++++ client screen +++++++++++++ 
  const [categoryid, setcategoryid] = useState('64ae859234fac5c2c966f337')
  const filterByCategoryId = (e) => {
    // console.log(e.target.value)
    setcategoryid(e.target.value)
  }



  const [count, setcount] = useState(0)

  const increment = (id) => {
    setcount(count + 1)
    const product = allProducts.find(product => product._id == id)
    product.quantity += 1;
    console.log(product)
  };

  const descrement = (id) => {
    setcount(count - 1)
    const product = allProducts.find(product => product._id == id)
    // console.log(product.quantity)
    if (product.quantity < 1) {
      product.quantity = 0
      deleteitems(id)
    } else {
      product.quantity = product.quantity - 1

    }
  };
  const [productnote, setproductnote] = useState('')
  const addnotrstoproduct = (e, id) => {
    e.preventDefault()
    const product = allProducts.find(product => product._id == id)
    product.notes = productnote
  }

  //list of items id to add & delete btn
  const [itemid, setitemid] = useState([])
  // add items to cart
  const [ItemsInCart, setItemsInCart] = useState([])

  const additemtocart = (id) => {
    console.log(id)
    const cartitem = allProducts.filter(item => item._id === id)
    console.log(cartitem)

    if (ItemsInCart.length > 0) {
      const repeateditem = ItemsInCart.filter(item => item._id === id)
      if (repeateditem.length == 0) {
        setItemsInCart([...ItemsInCart, ...cartitem])
        setitemid([...itemid, id])
      }
    } else {
      setItemsInCart([...cartitem])
      setitemid([id])

    }
  }

  // delete item from cart by id
  const quantityzero = (id) => {
    const product = allProducts.find((pro, i) => pro._id == id)
    setitemid(itemid.filter((i) => i !== id))
    product.quantity = 0
  }

  const deleteitems = (id) => {
    const withotdeleted = ItemsInCart.filter(item => item._id !== id)
    setItemsInCart(withotdeleted);
    quantityzero(id)
  }


  // Calculate costOrder of cart item
  const [costOrder, setcostOrder] = useState(0)
  const costOfOrder = () => {
    if (ItemsInCart.length > 0) {
      let total = 0;
      ItemsInCart.map((item) => {
        item.totalprice = item.priceAfterDiscount > 0 ? item.priceAfterDiscount * item.quantity : item.price * item.quantity;
        total += item.totalprice
        setcostOrder(total)
      })
    } else {
      setcostOrder(0)
    }
  }


  const generateSerial = (num) => {
    const str = num.toString();
    const pad = '000000';
    return pad.substring(0, pad.length - str.length) + str;
  };

  const createClientOrderForUser = async (userId) => {
    try {
      const userorder = allOrders.filter((o, i) => o.user == userId);
      const lastuserorder = userorder.length > 0 ? userorder[userorder.length - 1] : [];
      const lastuserorderactive = lastuserorder.isActive;

      if (lastuserorderactive == true) {
        const id = await lastuserorder._id;
        const oldproducts = await allOrders.find((order) => order._id == id).products;
        const oldsubTotal = await allOrders.find((order) => order._id == id).subTotal;
        const subTotal = costOrder + oldsubTotal;
        const tax = subTotal * 0.14;
        const deliveryCost = 10;
        const total = subTotal + tax + deliveryCost;

        if (lastuserorder.status == 'Preparing') {
          const additem = ItemsInCart.map((item) => ({ ...item, isAdd: true }));
          const products = [...additem, ...oldproducts];
          const status = 'Pending';
          const order_type = 'Delivery';
          const neworder = await axios.put('https://caviar-api.vercel.app/api/order/' + id, {
            products, subTotal, total, tax, deliveryCost, status, order_type
          });
          setItemsInCart([]);
          getProducts();
          toast.success("Items added to the current order!");
        } else {
          const products = [...ItemsInCart, ...oldproducts];
          const status = 'Pending';
          const order_type = 'Delivery';
          const neworder = await axios.put('https://caviar-api.vercel.app/api/order/' + id, {
            products, subTotal, total, tax, deliveryCost, status, order_type
          });
          setItemsInCart([]);
          getProducts();
        }

        setItemsInCart([]);
        getProducts();
        toast.success("Order updated successfully!");
      } else {
        try {
          const serial = allOrders.length > 0 ? allOrders[allOrders.length - 1].serial + 1 : 1;
          const finduser = allUsers.find((u, i) => u._id == userId);
          const user = finduser ? userId : null;
          const products = [...ItemsInCart];
          const subTotal = costOrder;
          const tax = subTotal * 0.14;
          const name = finduser ? finduser.username : '';
          const phone = finduser ? finduser.phone : '';
          const address = finduser ? finduser.address : '';
          const order_type = 'Delivery';
          const deliveryCost = 10;
          const total = subTotal + tax + deliveryCost;
          const neworder = await axios.post('https://caviar-api.vercel.app/api/order', {
            serial,
            products,
            subTotal,
            tax,
            deliveryCost,
            total,
            user,
            name,
            address,
            phone,
            order_type,
          });
          setItemsInCart([]);
          getProducts();
          toast.success("New order created successfully!");
        } catch (error) {
          console.log(error);
          toast.error("An error occurred while creating the order");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while processing the order");
    }
  };



  const createClientOrderForTable = async (tableId) => {
    try {
      const tableorder = allOrders.filter((o) => o.table === tableId);
      const lasttableorder = tableorder.length > 0 ? tableorder[tableorder.length - 1] : {};
      const lasttableorderactive = lasttableorder.isActive;

      if (lasttableorderactive === true) {
        const id = lasttableorder._id;
        const oldproducts = (allOrders.find((order) => order._id === id)).products;
        const oldsubTotal = (allOrders.find((order) => order._id === id)).subTotal;
        const status = lasttableorder.status;
        const subTotal = costOrder + oldsubTotal;
        console.log(subTotal)
        const tax = subTotal * 0.14;
        const total = subTotal + tax;

        if (status === 'Preparing') {
          const additem = [];
          for (let i = 0; i < ItemsInCart.length; i++) {
            ItemsInCart[i].isAdd = true;
            additem.push(ItemsInCart[i]);
          }
          const products = [...additem, ...oldproducts];
          const status = 'Pending';
          const neworder = await axios.put(`https://caviar-api.vercel.app/api/order/${id}`, {
            products,
            subTotal,
            total,
            tax,
            status,
          });
          setItemsInCart([]);
          getProducts();
          // Toast success message for updating order
          toast.success('Order updated successfully!');
        } else {
          const products = [...ItemsInCart, ...oldproducts];
          const status = 'Pending';
          const neworder = await axios.put(`https://caviar-api.vercel.app/api/order/${id}`, {
            products,
            subTotal,
            total,
            tax,
            status,
          });
          setItemsInCart([]);
          getProducts();

          // Toast success message for updating order
          toast.success('Order updated successfully!');
        }
      } else {
        const serial = allOrders.length > 0 ? allOrders[allOrders.length - 1].serial + 1 : 1;
        const table = allTable.find((t) => t._id === tableId) ? tableId : null;
        const finduser = allUsers.find((u) => u._id === tableId);
        const user = finduser ? tableId : null;
        const products = [...ItemsInCart];
        const subTotal = costOrder;
        const tax = subTotal * 0.14;
        const total = subTotal + tax;
        const order_type = 'Internal';

        const neworder = await axios.post('https://caviar-api.vercel.app/api/order', {
          serial,
          products,
          subTotal,
          tax,
          total,
          table,
          user,
          order_type,
        });
        setItemsInCart([]);
        getProducts();
        // Toast success message for creating a new order
        toast.success('New order created successfully!');
      }
    } catch (error) {
      console.log(error);
      // Display an error toast here
      toast.error('An error occurred while creating/updating the order');
    }
  };

  // const createClientOrder = async (clientid) => {
  //   const tableorder = allOrders.filter((o, i) => o.table == clientid);
  //   const lasttableorder = tableorder.length > 0 ? tableorder[tableorder.length - 1] : [];
  //   const lasttableorderactive = lasttableorder.isActive

  //   const userorder = allOrders.filter((o, i) => o.user == clientid);
  //   const lastuserorder = userorder.length > 0 ? userorder[userorder.length - 1] : [];
  //   const lastuserorderactive = lastuserorder.isActive

  //   if (clientid) {
  //     if (lasttableorderactive == true) {
  //       const id = await lasttableorder._id
  //       const oldproducts = await allOrders.find((order) => order._id == id).products;
  //       const oldsubTotal = await allOrders.find((order) => order._id == id).subTotal
  //       const status = lasttableorder.status
  //       // const products = [...ItemsInCart, ...oldproducts]
  //       const subTotal = costOrder + oldsubTotal
  //       const tax = total * 0.14
  //       const total = subTotal + tax
  //       console.log(ItemsInCart)

  //       if (status === 'Pending' || status === 'Approved' || status === 'Preparing') {
  //         const additem = []
  //         for (let i = 0; i < ItemsInCart.length; i++) {
  //           ItemsInCart[i].isAdd = true;
  //           additem.push(ItemsInCart[i])
  //         }
  //         console.log(additem)
  //         const products = [...additem, ...oldproducts]
  //         console.log(products)
  //         const status = 'Pending'
  //         const neworder = await axios.put('https://caviar-api.vercel.app/api/order/' + id, {
  //           products, subTotal, total, tax, status
  //         })
  //         setItemsInCart([])
  //         getProducts()
  //       } else {
  //         const products = [...ItemsInCart, ...oldproducts]
  //         console.log(products)
  //         const status = 'Pending'
  //         const neworder = await axios.put('https://caviar-api.vercel.app/api/order/' + id, {
  //           products, subTotal, total, tax, status
  //         })
  //       }
  //       setItemsInCart([])
  //       getProducts()
  //     } else if (lastuserorderactive == true) {
  //       const id = await lastuserorder._id
  //       const oldproducts = await allOrders.find((order) => order._id == id).products
  //       const oldsubTotal = await allOrders.find((order) => order._id == id).subTotal
  //       // const products = [...ItemsInCart, ...oldproducts]
  //       const subTotal = costOrder + oldsubTotal;
  //       const tax = subTotal * 0.14
  //       const deliveryCost = 10
  //       const total = subTotal + tax + deliveryCost
  //       if (lastuserorder.status == 'Preparing') {
  //         const additem = []
  //         for (let i = 0; i < ItemsInCart.length; i++) {
  //           ItemsInCart[i].isAdd = true;
  //           additem.push(ItemsInCart[i])
  //         }
  //         console.log(additem)
  //         const products = [...additem, ...oldproducts]
  //         console.log(products)
  //         const status = 'Pending'
  //         const order_type = 'Delivery'
  //         const neworder = await axios.put('https://caviar-api.vercel.app/api/order/' + id, {
  //           products, subTotal, total, tax, deliveryCost, status, order_type
  //         })
  //         setItemsInCart([])
  //         getProducts()
  //       } else {
  //         const products = [...ItemsInCart, ...oldproducts]
  //         console.log(products)
  //         const status = 'Pending'
  //         const order_type = 'Delivery'
  //         const neworder = await axios.put('https://caviar-api.vercel.app/api/order/' + id, {
  //           products, subTotal, total, tax, deliveryCost, status, order_type
  //         })
  //       }

  //       setItemsInCart([])
  //       getProducts()

  //     } else {
  //       try {
  //         const serial = allOrders.length > 0 ? allOrders[allOrders.length - 1].serial + 1 : 1;
  //         const table = allTable.find((t, i) => t._id == clientid) ? clientid : null;
  //         const finduser = allUsers.find((u, i) => u._id == clientid);
  //         const user = finduser ? clientid : null;
  //         const products = [...ItemsInCart]
  //         const subTotal = costOrder;
  //         const tax = subTotal * 0.14
  //         const name = finduser ? finduser.username : ''
  //         const phone = finduser ? finduser.phone : ''
  //         const address = finduser ? finduser.address : ''
  //         if (user) {
  //           const order_type = 'Delivery'
  //           const deliveryCost = 10
  //           const total = subTotal + tax + deliveryCost
  //           const neworder = await axios.post('https://caviar-api.vercel.app/api/order', {
  //             serial,
  //             products,
  //             subTotal,
  //             tax,
  //             deliveryCost,
  //             total,
  //             user,
  //             name,
  //             address,
  //             phone,
  //             order_type,
  //           })
  //           setItemsInCart([])
  //           getProducts()
  //         } else {
  //           const order_type = 'Internal'
  //           const total = subTotal + tax
  //           const neworder = await axios.post('https://caviar-api.vercel.app/api/order', {
  //             serial,
  //             products,
  //             subTotal,
  //             tax,
  //             total,
  //             table,
  //             user,
  //             order_type,
  //           })
  //         }
  //         // console.log(await neworder.data);
  //         setItemsInCart([])
  //         getProducts()
  //       } catch (error) {
  //         console.log(error)
  //       }
  //     }
  //   } else {
  //     window.alert("Please login or scan qr")
  //   }

  // }



  // Function to update an order




  const createWaiterOrder = async (tableid, waiterid) => {
    try {
      // Check for active orders for the table
      const tableorder = allOrders.filter((o, i) => o.table === tableid);
      const lasttableorder = tableorder.length > 0 ? tableorder[tableorder.length - 1] : null;
      const lasttableorderactive = lasttableorder ? lasttableorder.isActive : false;

      if (lasttableorderactive) {
        // Update the existing order
        const id = lasttableorder._id;
        const oldproducts = (await allOrders.find((order) => order._id === id)).products;
        const oldtotal = (await allOrders.find((order) => order._id === id)).total;

        const products = [...ItemsInCart, ...oldproducts];
        const subTotal = costOrder + oldtotal;
        const tax = subTotal * 0.14;
        const total = subTotal + tax;
        const status = 'Pending';
        const createBy = waiterid;

        const updatedOrder = await axios.put('https://caviar-api.vercel.app/api/order/' + id, {
          products,
          subTotal,
          total,
          tax,
          status,
          createBy
        });

        toast.success('Order updated successfully!');
        setItemsInCart([]);
        getProducts();
      } else {
        // Create a new order
        const serial = allOrders.length > 0 ? allOrders[allOrders.length - 1].serial + 1 : 1;
        const products = [...ItemsInCart];
        const subTotal = costOrder;
        const tax = subTotal * 0.14;
        const total = subTotal + tax;
        const order_type = 'Internal';

        const neworder = await axios.post('https://caviar-api.vercel.app/api/order', {
          serial,
          table: tableid,
          products,
          subTotal,
          total,
          tax,
          order_type,
          createBy: waiterid
        });

        toast.success('New order created successfully!');
        setItemsInCart([]);
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred. Please try again.');
    }
  };


  const createCasherOrder = async (casherid, clientname, clientphone, clientaddress, ordertype, deliveryCost) => {
    try {
      const dayOrders = allOrders.filter((order) => new Date(order.createdAt).getDay() === new Date().getDay());
      const ordernum = dayOrders.length > 0 ? dayOrders[dayOrders.length - 1].ordernum + 1 : 1;

      const serial = allOrders.length > 0 ? allOrders[allOrders.length - 1].serial + 1 : 1;
      const products = [...ItemsInCart];
      const subTotal = costOrder;
      const tax = subTotal * 0.14;
      const total = deliveryCost > 0 ? subTotal + tax + deliveryCost : subTotal + tax;
      const name = await clientname;
      const phone = await clientphone;
      const address = await clientaddress;
      const employee = await casherid;
      const orderType = await ordertype;

      const newOrder = await axios.post('https://caviar-api.vercel.app/api/order', {
        serial,
        ordernum,
        products,
        subTotal,
        tax,
        deliveryCost,
        total,
        orderType,
        employee,
        name,
        phone,
        address
      });

      toast.success('Order created successfully!');
      setItemsInCart([]);

    } catch (error) {
      console.log(error);
      toast.error('An error occurred. Please try again.');
    }
  };



  const [myorder, setmyorder] = useState({})
  const [totalinvoice, settotalinvoice] = useState(0)
  const [list_products_order, setlist_products_order] = useState([])
  const [orderupdate_date, setorderupdate_date] = useState('')
  const [myorderid, setmyorderid] = useState()
  const [ordertax, setordertax] = useState()
  const [ordertotal, setordertotal] = useState()
  const [ordersubtotal, setordersubtotal] = useState()
  const [orderdeliveryCost, setorderdeliveryCost] = useState()

  const invoice = async (clientid) => {
    console.log(clientid)
    // console.log(allOrders)
    const tableorder = allOrders.filter((o, i) => o.table == clientid);
    const lasttableorder = tableorder.length > 0 ? tableorder[tableorder.length - 1] : [];
    const lasttableorderactive = lasttableorder.isActive
    const userorder = allOrders.filter((o, i) => o.user == clientid);
    const lastuserorder = userorder.length > 0 ? userorder[userorder.length - 1] : [];
    const lastuserorderactive = lastuserorder.isActive

    if (clientid) {
      if (lasttableorderactive) {
        const id = await lasttableorder._id
        const myorder = await axios.get('https://caviar-api.vercel.app/api/order/' + id,)
        const data = myorder.data
        console.log(data)
        console.log(data._id)
        setmyorder(data)
        settotalinvoice(data.total)
        setmyorderid(data._id)
        setlist_products_order(data.products)
        setorderupdate_date(data.updatedAt)
        setordertotal(data.total)
        setordersubtotal(data.subTotal)
        setordertax(data.tax)
        setItemsInCart([])

      } else if (lastuserorderactive) {
        const id = await lastuserorder._id
        const myorder = await axios.get('https://caviar-api.vercel.app/api/order/' + id,)
        const data = await myorder.data
        console.log(data)
        setmyorder(data)
        setmyorderid(data._id)
        settotalinvoice(data.total)
        setlist_products_order(data.products)
        setorderupdate_date(data.updatedAt)
        setordertotal(data.total)
        setordersubtotal(data.subtotal)
        setordertax(data.tax)
        setorderdeliveryCost(data.deliveryCost)
        setItemsInCart([])
      }
    } else {
      window.alert("Please login or scan qr")
    }

  }

  const checkout = async () => {
    try {
      const id = myorderid;
      const isActive = false;
      const help = 'Requesting the bill';

      // Update order to mark it for checkout
      const updatedOrder = await axios.put(`https://caviar-api.vercel.app/api/order/${id}`, {
        isActive,
        help
      });

      // Show success toast after successfully marking order for checkout
      toast.success('Order marked for checkout');

      // Redirect after 10 minutes
      setTimeout(() => {
        window.location.href = `https://${window.location.hostname}`;
      }, 60000 * 10);
    } catch (error) {
      console.log(error);
      // Show error toast if there's an issue with marking the order for checkout
      toast.error('Failed to mark order for checkout');
    }
  };


  const POSinvoice = async (checkid) => {
    // console.log(allOrders)
    const tableorder = allOrders.filter((o, i) => o.table == checkid);
    const lasttableorder = tableorder.length > 0 ? tableorder[tableorder.length - 1] : [];
    const lasttableorderactive = await lasttableorder.isActive
    const employeeorder = allOrders.filter((o, i) => o.employee == checkid);
    const lastemployeeorder = employeeorder.length > 0 ? employeeorder[employeeorder.length - 1] : [];
    const lastemployeeorderactive = await lastemployeeorder.isActive

    if (lasttableorderactive) {
      const id = await lasttableorder._id
      const myorder = await axios.get('https://caviar-api.vercel.app/api/order/' + id,)
      const data = await myorder.data
      setmyorder(data)
      settotalinvoice(data.total)
      setmyorderid(data._id)
      setlist_products_order(data.products)
      setorderupdate_date(data.updatedAt)
      setItemsInCart([])
    } else if (lastemployeeorderactive) {
      const id = await lastemployeeorder._id
      const myorder = await axios.get('https://caviar-api.vercel.app/api/order/' + id,)
      const data = await myorder.data
      console.log(data)
      setmyorder(data)
      setmyorderid(data._id)
      settotalinvoice(data.total)
      setlist_products_order(data.products)
      setorderupdate_date(data.updatedAt)
      setItemsInCart([])
    }
  }

  const updatecountofsales = async (id) => {
    const myorder = await axios.get('https://caviar-api.vercel.app/api/order/' + id,)
    const data = myorder.data
    for (var i = 0; i < data.products.length; i++) {
      const productid = await data.products[i]._id
      const productquantity = await data.products[i].quantity
      const findprduct = await axios.get('https://caviar-api.vercel.app/api/product/' + productid)
      const sales = await findprduct.data.sales + productquantity

      console.log(productid)
      console.log(findprduct)
      console.log(sales)
      console.log(productquantity)
      const updatprduct = await axios.put('https://caviar-api.vercel.app/api/product/withoutimage/' + productid, {
        sales
      })
      console.log(updatprduct)

    }
  }

  const askingForHelp = async (tablenum) => {
    const tableorder = allOrders.filter((o, i) => o.table == tablenum);
    const lasttableorder = tableorder.length > 0 ? tableorder[tableorder.length - 1] : [];
    const lasttableorderactive = await lasttableorder.isActive

    const id = await lasttableorder._id
    console.log(id)
    const serial = allOrders.length > 0 ? allOrders[allOrders.length - 1].serial + 1 : 1;
    console.log(serial)
    const help = 'Requests assistance';
    const table = tablenum
    if (!lasttableorderactive) {
      const neworder = await axios.post('https://caviar-api.vercel.app/api/order/', {
        serial, table, help
      })
      console.log(neworder)
    } else {
      const neworder = await axios.put('https://caviar-api.vercel.app/api/order/' + id, {
        help
      })
      console.log(neworder)
      // window.location.href = `http://localhost:3000/`;
    }
  }


  const usertitle = (id) => {
    const istable = allTable ? allTable.find((table, i) => table._id == id) : null;
    const isuser = allUsers ? allUsers.find((user, i) => user._id == id) : null
    const isemployee = allemployees ? allemployees.find((employee, i) => employee._id == id) : null
    if (istable) {
      const table_num = istable.tablenum
      return table_num
    } else if (isuser) {
      const user_name = isuser.username
      return user_name
    } else if (isemployee) {
      const employee_name = isemployee.username
      return employee_name
    }
  }

  const [list_day_order, setlist_day_order] = useState([])
  const [total_day_salse, settotal_day_salse] = useState(0)

  const Payment_pending_orders = async () => {
    const dayorder = allOrders.filter((order) => new Date(order.createdAt).getDay() == new Date().getDay())
    setlist_day_order(dayorder)
    // console.log(dayorder)
    if (dayorder.length > 0) {
      const order_day_paid = dayorder.filter((order) => order.payment_status == 'Paid')
      //  console.log(order_day_paid)
      let total = 0;
      if (order_day_paid.length > 0) {
        for (let i = 0; i < order_day_paid.length; i++) {
          total = order_day_paid[i].total + total
          settotal_day_salse(total)
        }
        // console.log(total_day_salse)
      }
    }
  }
  //++++++++++++++++++++++++++ AUTH ++++++++++++++++++++++++++++
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  axios.defaults.withCredentials = true;

  const signup = async (e, username, password, phone, address, email, setToken) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://caviar-api.vercel.app/api/auth/signup', {
        username,
        password,
        phone,
        address,
        email,
      });

      if (response && response.data) {
        const { accessToken } = response.data;

        if (accessToken) {
          // Store the token in the component state using the provided setToken function
          setToken(accessToken);
          // Optionally, you can store the token in localStorage here if required
          // localStorage.setItem('token_u', accessToken);
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      // Handle errors appropriately (e.g., display an error message to the user)
    }
  };


  const [userLoginInfo, setUserLoginInfo] = useState(null);
  const [employeeLoginInfo, setEmployeeLoginInfo] = useState(null);

  const getUserInfoFromToken = () => {
    const userToken = localStorage.getItem('token_u');
    const employeeToken = localStorage.getItem('token_e');

    let decodedToken = null;

    if (employeeToken && userToken) {
      decodedToken = jwt_decode(employeeToken);
      setEmployeeLoginInfo(decodedToken);
      console.log(decodedToken.employeeinfo);

      decodedToken = jwt_decode(userToken);
      setUserLoginInfo(decodedToken);
    } else if (employeeToken) {
      decodedToken = jwt_decode(employeeToken);
      setEmployeeLoginInfo(decodedToken);
      console.log(decodedToken.employeeinfo);
    } else if (userToken) {
      decodedToken = jwt_decode(userToken);
      setUserLoginInfo(decodedToken);
    } else {
      setUserLoginInfo(null);
      setEmployeeLoginInfo(null);
    }

    return decodedToken;
  };


  const [isLogin, setisLogin] = useState(false);

  const login = async (e, phone, password) => {
    e.preventDefault();
    console.log({ phone, password });

    try {
      if (!phone || !password) {
        toast.error('Phone and password are required.');
        return;
      }

      const response = await axios.post('https://caviar-api.vercel.app/api/auth/login', {
        phone,
        password,
      });

      if (response && response.data) {
        const { accessToken, findUser } = response.data;

        if (accessToken && findUser.isActive) {
          localStorage.setItem('token_u', accessToken);
          getUserInfoFromToken();
          // setisLogin(!isLogin);
          toast.success('Login successful!');
        } else {
          toast.error('User is not active.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
    }
  };


  const employeelogin = async (e, phone, password) => {
    e.preventDefault();

    if (!phone || !password) {
      toast('Phone and Password are required');
      return;
    }

    try {
      const response = await axios.post('https://caviar-api.vercel.app/api/employee/login', {
        phone,
        password,
      });

      if (response && response.data) {
        const { data } = response;

        console.log(data.message);
        toast(data.message);

        if (data.accessToken) {
          localStorage.setItem('token_e', data.accessToken);
          const userInfo = getUserInfoFromToken();

          console.log(userInfo);
        }

        if (data.findEmployee.isActive === true) {
          window.location.href = `https://${window.location.hostname}/management`;
        } else {
          toast('This user is not authorized to log in');
        }
      }
    } catch (error) {
      console.log(error);

      if (error.response && error.response.data && error.response.data.message) {
        toast(error.response.data.message);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token_u');
    window.location.href = `https://${window.location.hostname}`;
  }

  const employeelogout = () => {
    localStorage.removeItem('token_e');
    window.location.href = `https://${window.location.hostname}/login`;
  }


  useEffect(() => {
    getProducts()
    getCategories()
    getallOrders()
    getallTable();
    getallUsers();
    getallemployees()
    // getUserInfoFromToken()
  }, [])



  useEffect(() => {
    Payment_pending_orders()
  }, [allOrders])

  useEffect(() => {
    costOfOrder()
    getallTable();
    getallUsers();
    getallOrders()
    costOfOrder()
    getUserInfoFromToken()
    Payment_pending_orders()

  }, [count, ItemsInCart, isLogin])

  return (
    <detacontext.Provider value={{
      // Functions related to authentication
      userLoginInfo, employeeLoginInfo, getUserInfoFromToken, login, signup, logout, employeelogin, employeelogout,

      // Functions related to products and categories
      allProducts, allcategories, filterByCategoryId, setcategoryid, deleteitems,

      // Functions related to users, tables, and orders
      allUsers, allTable, usertitle, allOrders, askingForHelp,

      // Functions related to manipulating product details
      setproductnote, addnotrstoproduct,

      // Functions related to order processing and calculations
      invoice, totalinvoice, list_products_order, orderupdate_date, myorder,
      list_day_order, total_day_salse, categoryid, ItemsInCart, costOrder,
      additemtocart, increment, descrement,

      // Functions related to creating different types of orders
      createClientOrder, checkout, calcTotalSalesOfCategory, updatecountofsales,
      createWaiterOrder, createCasherOrder, POSinvoice,

      // Functions related to pagination
      EditPagination, startpagination, endpagination, setstartpagination, setendpagination,

      // Other utility functions or state variables
      itemid, setitemid, showdate,
      ordertotal, ordersubtotal, ordertax, orderdeliveryCost,
      createClientOrderForTable, createClientOrderForUser
    }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Userscreen />} />
          <Route path='/:id' element={<Userscreen />} />

          <Route path='/login' element={<Login />} />

          <Route path='/management/*' element={<ManagLayout />}>
            <Route index element={<ManagerDash />} />
            <Route path='orders' element={<Orders />} />
            <Route path='products' element={<Products />} />
            <Route path='productrecipe' element={<ProductRecipe />} />
            <Route path='tables' element={<Tables />} />
            <Route path='employees' element={<Employees />} />
            <Route path='Employeessalary' element={<EmployeesSalary />} />
            <Route path='payroll' element={<PayRoll />} />
            <Route path='category' element={<Category />} />
            <Route path='kitchen' element={<Kitchen />} />
            <Route path='waiter' element={<Waiter />} />
            <Route path='pos' element={<POS />} />
            <Route path='categoryStock' element={<CategoryStock />} />
            <Route path='stockitem' element={<StockItem />} />
            <Route path='stockmang' element={<StockManag />} />
            <Route path='expense' element={<ExpenseItem />} />
            <Route path='dailyexpense' element={<DailyExpense />} />
            <Route path='cashregister' element={<CashRegister />} />
            <Route path='cashmovement' element={<CashMovement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </detacontext.Provider>
  );
}

export default App;