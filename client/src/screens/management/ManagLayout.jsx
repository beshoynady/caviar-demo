import React, {useState, useEffect} from 'react';
import './ManagLayout.css'
import { detacontext } from '../../App'
import { Navigate, Outlet } from 'react-router-dom';
import NavBar from './manag.component/navbar/NavBar';
import SideBar from './manag.component/sidebar/SideBar';
import jwt_decode from "jwt-decode";
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const ManagLayout = () => {
  const socket = io('https://caviar-api.vercel.app');

  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState(null);

  useEffect(() => {
    // Listen for new orders from the server
    socket.on('newOrder', (order) => {
      setNewOrder(order);
    });

    // Clean up the socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (newOrder) {
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      showToast(`New order received: ${newOrder.id}`);
    }
  }, [newOrder]);

  const showToast = (message) => {
    toast.success(message);
  };

    if (localStorage.getItem('token_e')) {
      // console.log(localStorage.getItem('token'))
      const tokenStorage = localStorage.getItem('token_e')
      if (tokenStorage) {
        const decodetoken = jwt_decode(tokenStorage)
        console.log(decodetoken)
       if(decodetoken.employeeinfo.isActive){
        return(
          <div className='manag-screen'>
            <SideBar />
            <main className='manag_main'>
              {/* <NavBar /> */}
              <Outlet></Outlet>
            </main>
            <ToastContainer />
          </div>)
          }
        }
      }else{
            return <Navigate to={'/login'} />
          }
      }
      
export default ManagLayout