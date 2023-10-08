import React, { createContext, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios';
import './App.css';
import jwt_decode from "jwt-decode";


import Userscreen from './screens/user.screen/Userscreen';


import ManagLayout from './screens/management/ManagLayout';
import ManagerDash from './screens/management/manag.component/managerdash/ManagerDash';
import Orders from './screens/management/manag.component/orders/Orders';
import Products from './screens/management/manag.component/products/Products';
import Tables from './screens/management/manag.component/tables/Tables';
import Employees from './screens/management/manag.component/employees/Employees';
import Category from './screens/management/manag.component/category/Category';
import Kitchen from './screens/management/manag.component/kitchen/Kitchen';
import Waiter from './screens/management/manag.component/waiter/Waiter';
import Login from './screens/management/manag.component/login/Login';
import POS from './screens/management/manag.component/pos/POS';
import StockItem from './screens/management/manag.component/stock/StockItem'
import StockManag from './screens/management/manag.component/stock/StockManag';


export const detacontext = createContext({})

function App() {
//++++++++++++++++++++ pagination ++++++++++

  const [pagination, setpagination] = useState(5)
  const EditPagination = (e) => {
    if (e.target.innerHTML == 'Next') {
      setpagination(pagination + 5)
    } else if (e.target.innerHTML == 'Previous') {
      if (pagination <= 5) {
        setpagination(5)
      } else {
        setpagination(pagination - 5)
      }
    } else {
      setpagination(e.target.innerHTML * 5)
    }
  }


  //+++++++++++++++++ product ++++++++++++++++++++
  const [allProducts, setallProducts] = useState([])
  const getProducts = async () => {
    const products = await axios.get('https://restaurant-api-blush.vercel.app/api/product')
    setallProducts(products.data)
  }

  //+++++++ category +++++++++++
  const [allcategories, setallcategories] = useState([])
  const getCategories = async () => {
    try {
      const allcategories = await axios.get('https://restaurant-api-blush.vercel.app/api/category')
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
  const [allorders, setallorders] = useState([])
  const getallorders = async () => {
    const orders = await axios.get('https://restaurant-api-blush.vercel.app/api/order');
    setallorders(orders.data)
  }



  //+++++++++++ table ++++++++++++++
  const [alltable, setalltable] = useState([])
  const getalltable = async () => {
    const tables = await axios.get('https://restaurant-api-blush.vercel.app/api/table');
    setalltable(tables.data)
  }


  // +++++++++++++++ user +++++++++++++
  const [allusers, setallusers] = useState([])
  const getallusers = async () => {
    const users = await axios.get('https://restaurant-api-blush.vercel.app/api/user');
    setallusers(users.data)
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
    // console.log(product.quantity)
  };

  const descrement = (id) => {
    setcount(count - 1)
    const product = allProducts.find(product => product._id == id)
    // console.log(product.quantity)
    if (product.quantity < 1) {
      product.quantity = 0
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
  // add items to cart
  const [itemsincart, setitemsincart] = useState([])

  const additemtocart = (id) => {
    console.log(id)
    const cartitem = allProducts.filter(item => item._id === id)
    console.log(cartitem)

    if (itemsincart.length > 0) {
      const repeateditem = itemsincart.filter(item => item._id === id)
      if (repeateditem.length == 0) {
        setitemsincart([...itemsincart, ...cartitem])
      }
    } else {
      setitemsincart([...cartitem])
    }
  }

  // delete item from cart by id
  const deleteitems = (id) => {
    const withotdeleted = itemsincart.filter(item => item._id !== id)
    const product = allProducts.find((pro, i) => pro._id = id)
    product.quantity = 0
    setitemsincart(withotdeleted);
  }


  // Calculate costOrder of cart item
  const [costOrder, setcostOrder] = useState(0)
  const costOfOrder = () => {
    if (itemsincart.length > 0) {
      let total = 0;
      itemsincart.map((item) => {
        item.totalprice = item.price * item.quantity;
        total += item.totalprice
        setcostOrder(total)
      })
    } else {
      setcostOrder(0)
    }
  }



  const createclientorder = async (clientid) => {
    const tableorder = allorders.filter((o, i) => o.table == clientid);
    const lasttableorder = tableorder.length > 0 ? tableorder[tableorder.length - 1] : [];
    const lasttableorderactive = lasttableorder.isActive

    const userorder = allorders.filter((o, i) => o.user == clientid);
    const lastuserorder = userorder.length > 0 ? userorder[userorder.length - 1] : [];
    const lastuserorderactive = lastuserorder.isActive

    if (clientid) {
      if (lasttableorderactive) {
        const id = await lasttableorder._id
        const oldproducts = await allorders.find((order) => order._id == id).products;
        const oldtotal = await allorders.find((order) => order._id == id).total
        const products = [...itemsincart, ...oldproducts]
        const total = costOrder + oldtotal
        const status = 'انتظار'
        const neworder = await axios.put('https://restaurant-api-blush.vercel.app/api/order/' + id, {
          products, total, status
        })
        setitemsincart([])
      } else if (lastuserorderactive) {
        const id = await lastuserorder._id
        const oldproducts = await allorders.find((order) => order._id == id).products
        const oldtotal = await allorders.find((order) => order._id == id).total
        const products = [...itemsincart, ...oldproducts]
        const total = costOrder + oldtotal;
        const status = 'انتظار'
        const order_type = 'ديلفري'
        const neworder = await axios.put('https://restaurant-api-blush.vercel.app/api/order/' + id, {
          products, total, status, order_type
        })
        // console.log(neworder.data);
        setitemsincart([])
      } else {
        try {
          const serial = allorders.length > 0 ? allorders[allorders.length - 1].serial + 1 : 1;
          const table = alltable.find((t, i) => t._id == clientid) ? clientid : null;
          const user = allusers.find((u, i) => u._id == clientid) ? clientid : null;
          const products = [...itemsincart]
          const total = costOrder;
          if (user) {
            const order_type = 'ديلفري'
            const neworder = await axios.post('https://restaurant-api-blush.vercel.app/api/order', {
              serial,
              table,
              user,
              products,
              total,
              order_type
            })
          } else {
            const order_type = 'داخلي'
            const neworder = await axios.post('https://restaurant-api-blush.vercel.app/api/order', {
              serial,
              table,
              user,
              products,
              total,
              order_type
            })
          }
          // console.log(await neworder.data);
          setitemsincart([])

        } catch (error) {
          console.log(error)
        }
      }
    } else {
      window.alert("Please login or scan qr")
    }

  }

  const CreateWaiterOrder = async (tableid, waiterid) => {
    console.log(tableid)
    console.log(waiterid)
    const tableorder = allorders.filter((o, i) => o.table == tableid);
    const lasttableorder = tableorder.length > 0 ? tableorder[tableorder.length - 1] : [];
    const lasttableorderactive = lasttableorder.isActive

    if (lasttableorderactive) {
      const id = await lasttableorder._id
      const oldproducts = await allorders.find((order) => order._id == id).products;
      const oldtotal = await allorders.find((order) => order._id == id).total
      const products = [...itemsincart, ...oldproducts]
      const total = costOrder + oldtotal
      const status = 'انتظار'
      const employee = waiterid
      const neworder = await axios.put('https://restaurant-api-blush.vercel.app/api/order/' + id, {
        products, total, status, employee
      })
      console.log(employee)
      console.log(neworder)
      setitemsincart([])
    } else {
      try {
        const serial = allorders.length > 0 ? allorders[allorders.length - 1].serial + 1 : 1;
        const products = [...itemsincart]
        const total = costOrder;
        const table = await tableid
        const employee = await waiterid;
        const order_type = 'داخلي';
        console.log(table)
        console.log(employee)
        const neworder = await axios.post('https://restaurant-api-blush.vercel.app/api/order', {
          serial,
          table,
          products,
          total,
          order_type,
          employee
        })
        console.log(neworder)
        setitemsincart([])

      } catch (error) {
        console.log(error)
      }
    }
  }

  const CreateCasherOrder = async (casherid, clientname, clientphone, clientaddress, ordertype) => {
    try {
      const dayorders =allorders.length > 0 ? allorders.filter((order) => new Date(order.createdAt).getDay() == new Date().getDay()):''
      // const ordernum =  new Date().getHours() == 0 && new Date().getMinutes() >= 0 ?
      //  allorders.find(order => order.createdAt.
      const ordernum = dayorders.length > 0 ? dayorders[dayorders.length - 1].ordernum + 1 : 1
      const serial = allorders.length > 0 ? allorders[allorders.length - 1].serial + 1 : 1;
      const products = [...itemsincart]
      const total = costOrder;
      const name = await clientname;
      const phone = await clientphone;
      const address = await clientaddress;
      const employee = await casherid;
      const order_type = await ordertype;
      const neworder = await axios.post('https://restaurant-api-blush.vercel.app/api/order', {
        serial,
        ordernum,
        products,
        total,
        order_type,
        employee,
        name,
        phone,
        address
      })
      console.log(neworder)
      setitemsincart([])

    } catch (error) {
      console.log(error)
    }
  }

  const [myorder, setmyorder] = useState({})
  const [totalinvoice, settotalinvoice] = useState(0)
  const [list_produccts_order, setlist_produccts_order] = useState([])
  const [orderupdate_date, setorderupdate_date] = useState('')
  const [myorderid, setmyorderid] = useState()

  const invoice = async (clientid) => {
    // console.log(allorders)
    const tableorder = allorders.filter((o, i) => o.table == clientid);
    const lasttableorder = tableorder.length > 0 ? tableorder[tableorder.length - 1] : [];
    const lasttableorderactive = lasttableorder.isActive
    const userorder = allorders.filter((o, i) => o.user == clientid);
    const lastuserorder = userorder.length > 0 ? userorder[userorder.length - 1] : [];
    const lastuserorderactive = lastuserorder.isActive

    if (clientid) {
      if (lasttableorderactive) {
        const id = await lasttableorder._id
        const myorder = await axios.get('https://restaurant-api-blush.vercel.app/api/order/' + id,)
        const data = myorder.data
        setmyorder(data)
        settotalinvoice(data.total)
        setmyorderid(data._id)
        setlist_produccts_order(data.products)
        setorderupdate_date(data.updatedAt)
        setitemsincart([])
      } else if (lastuserorderactive) {
        const id = await lastuserorder._id
        const myorder = await axios.get('https://restaurant-api-blush.vercel.app/api/order/' + id,)
        const data = myorder.data
        console.log(data)
        setmyorder(data)
        setmyorderid(data._id)
        settotalinvoice(data.total)
        setlist_produccts_order(data.products)
        setorderupdate_date(data.updatedAt)
        setitemsincart([])
        // for (var i = 0; i < data.products.length; i++){
        //   const productid =await data.products[i]._id
        //   const productquantity =await  data.products[i].quantity
        //   const findprduct = await axios.get('https://restaurant-api-blush.vercel.app/api/product/' + productid)
        //   const sales = await findprduct.data.sales + productquantity

        //   console.log(productid)
        //   console.log(findprduct)
        //   console.log(sales)
        //   console.log(productquantity)
        //   const updatprduct = await axios.put('https://restaurant-api-blush.vercel.app/api/product/withoutimage/' + productid,{
        //     sales
        //   })
        //   console.log(updatprduct)

        // }
      }
    } else {
      window.alert("Please login or scan qr")
    }

  }

  const POSinvoice = async (checkid) => {
    // console.log(allorders)
    const tableorder = allorders.filter((o, i) => o.table == checkid);
    const lasttableorder = tableorder.length > 0 ? tableorder[tableorder.length - 1] : [];
    const lasttableorderactive = lasttableorder.isActive
    const employeeorder = allorders.filter((o, i) => o.employee == checkid);
    const lastemployeeorder = employeeorder.length > 0 ? employeeorder[employeeorder.length - 1] : [];
    const lastemployeeorderactive = lastemployeeorder.isActive

      if (lasttableorderactive) {
        const id = await lasttableorder._id
        const myorder = await axios.get('https://restaurant-api-blush.vercel.app/api/order/' + id,)
        const data = myorder.data
        setmyorder(data)
        settotalinvoice(data.total)
        setmyorderid(data._id)
        setlist_produccts_order(data.products)
        setorderupdate_date(data.updatedAt)
        setitemsincart([])
      } else if (lastemployeeorderactive) {
        const id = await lastemployeeorder._id
        const myorder = await axios.get('https://restaurant-api-blush.vercel.app/api/order/' + id,)
        const data = myorder.data
        console.log(data)
        setmyorder(data)
        setmyorderid(data._id)
        settotalinvoice(data.total)
        setlist_produccts_order(data.products)
        setorderupdate_date(data.updatedAt)
        setitemsincart([])
      }
  }

  const updatecountofsales = async (id) => {
    const myorder = await axios.get('https://restaurant-api-blush.vercel.app/api/order/' + id,)
    const data = myorder.data
    for (var i = 0; i < data.products.length; i++) {
      const productid = await data.products[i]._id
      const productquantity = await data.products[i].quantity
      const findprduct = await axios.get('https://restaurant-api-blush.vercel.app/api/product/' + productid)
      const sales = await findprduct.data.sales + productquantity

      console.log(productid)
      console.log(findprduct)
      console.log(sales)
      console.log(productquantity)
      const updatprduct = await axios.put('https://restaurant-api-blush.vercel.app/api/product/withoutimage/' + productid, {
        sales
      })
      console.log(updatprduct)

    }
  }

  const askingForHelp = async (tablenum) => {
    const tableorder = allorders.filter((o, i) => o.table == tablenum);
    const lasttableorder = tableorder.length > 0 ? tableorder[tableorder.length - 1] : [];
    const lasttableorderactive = await lasttableorder.isActive

    const id = await lasttableorder._id
    console.log(id)
    const serial = allorders.length > 0 ? allorders[allorders.length - 1].serial + 1 : 1;
    console.log(serial)
    const help = 'يطلب مساعدة';
    const table = tablenum
    if (!lasttableorderactive) {
      const neworder = await axios.post('https://restaurant-api-blush.vercel.app/api/order/', {
        serial, table, help
      })
      console.log(neworder)
    } else {
      const neworder = await axios.put('https://restaurant-api-blush.vercel.app/api/order/' + id, {
        help
      })
      console.log(neworder)
      // window.location.href = `http://localhost:3000/`;
    }
  }

  const checkout = async () => {
    console.log(myorderid)
    const id = myorderid
    // console.log(id)
    const isActive = false;
    const neworder = await axios.put('https://restaurant-api-blush.vercel.app/api/order/' + id, {
      isActive
    })
    console.log(neworder)
    setTimeout(() => {
      window.location.href = `https://${window.location.hostname}`;
    }, 2000);
  }



  const usertitle = (id) => {
    const istable = alltable.find((table, i) => table._id === id);
    const isuser = allusers.find((user, i) => user._id === id)
    if (istable) {
      const table_num = alltable.find((table, i) => table._id === id).tablenum
      return table_num
    } else if (isuser) {
      const user_name = allusers.find((user, i) => user._id === id).username
      return user_name
    }
  }

  const [list_day_order, setlist_day_order] = useState([])
  const [total_day_salse, settotal_day_salse] = useState(0)

  const Payment_pending_orders = async () => {
    const dayorder = allorders.filter((order) => new Date(order.createdAt).getDay() == new Date().getDay())
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

  const signup = async (e, username, password, phone, address, email) => {
    e.preventDefault()
    try {
      const newclient = await axios.post('https://restaurant-api-blush.vercel.app/api/auth/signup', { username, password, phone, address, email })
      console.log(newclient)
      if (newclient) {
        const token = newclient.accessToken
        localStorage.setItem("token", token)
      }
      // navigate('/login')

    } catch (error) {
      console.log(error)
    }
  }

  const [userlogininfo, setuserlogininfo] = useState(null)
  const getdatafromtoken = () => {
    const tokenStorage = localStorage.getItem('token')
    if (tokenStorage) {
      const decodetoken = jwt_decode(tokenStorage)
      setuserlogininfo(decodetoken.userinfo)
      console.log(decodetoken)
    }
  }

  const [islogin, setislogin] = useState(false)
  const login = async (e, phone, password) => {
    e.preventDefault()
    console.log(phone);
    console.log(password);
    try {
      const client = await axios.post('https://restaurant-api-blush.vercel.app/api/auth/login', { phone, password })
      console.log(client.data)
      if (client) {
        setislogin(!islogin)
        const token = client.data.accessToken;
        console.log(token)
        if (token) {
          localStorage.setItem("token", token)
          if (localStorage.getItem('token')) {
            getdatafromtoken()
          }
        }
        setislogin(!islogin)
        // returnToMange()
      }
      if (client.data.finduser.isAdmin == true) {
        window.location.href = `https://${window.location.hostname}/management`;
      }
    } catch (error) {
      console.log(error)
    }
  }

  const logout = () => {
    localStorage.clear('token');
    window.location.href = `https://${window.location.hostname}`;
  }


  useEffect(() => {
    getProducts()
    getCategories()
    getallorders()
    getalltable();
    getallusers();
    // if (localStorage.getItem('token')) {
    //   getdatafromtoken()
    // }
  }, [])



  useEffect(() => {
    Payment_pending_orders()
  }, [allorders])

  useEffect(() => {
    costOfOrder()
    getalltable();
    getallusers();
    getallorders()
    costOfOrder()
    getdatafromtoken()

  }, [count, itemsincart, islogin])

  return (
    <detacontext.Provider value={{
      userlogininfo, getdatafromtoken, login, signup, logout,
      allProducts, allcategories, filterByCategoryId, setcategoryid, deleteitems,
      allusers, alltable, usertitle, allorders, askingForHelp,
      setproductnote, addnotrstoproduct,
      invoice, totalinvoice, list_produccts_order, orderupdate_date, myorder,
      list_day_order, total_day_salse,
      categoryid, itemsincart, costOrder, additemtocart, increment, descrement,
      createclientorder, checkout, calcTotalSalesOfCategory, updatecountofsales,
      CreateWaiterOrder, CreateCasherOrder ,POSinvoice,
      EditPagination,pagination
    }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Userscreen />} />
          <Route path='/:id' element={<Userscreen />} />

          <Route path='/login' element={<Login />} />
          <Route exact path='/management' element={<ManagLayout />}>
            <Route index element={<ManagerDash />} />
            <Route path='orders' element={<Orders />} />
            <Route path='products' element={<Products />} />
            <Route path='tables' element={<Tables />} />
            <Route path='employees' element={<Employees />} />
            <Route path='category' element={<Category />} />
            <Route path='kitchen' element={<Kitchen />} />
            <Route path='waiter' element={<Waiter />} />
            <Route path='pos' element={<POS />} />
            <Route path='stockitem' element={<StockItem/>} />
            <Route path='stockmang' element={<StockManag/>} />
          </Route>

        </Routes>
      </BrowserRouter>
    </detacontext.Provider>
  );
}

export default App;