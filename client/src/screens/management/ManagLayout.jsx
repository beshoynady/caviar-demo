import React, {useState, useEffect} from 'react';
import './ManagLayout.css'
import { detacontext } from '../../App'
import { Navigate, Outlet } from 'react-router-dom';
import NavBar from './manag.component/navbar/NavBar';
import SideBar from './manag.component/sidebar/SideBar';
import jwt_decode from "jwt-decode";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ManagLayout = () => {
  const notify = () => toast("Wow so easy!");

    if (localStorage.getItem('token_e')) {
      // console.log(localStorage.getItem('token'))
      const tokenStorage = localStorage.getItem('token_e')
      if (tokenStorage) {
        const decodetoken = jwt_decode(tokenStorage)
        console.log(decodetoken)
       if(decodetoken.employeeinfo.isActive){
        return(
          <div className='manag-screen'>
                    <button onClick={notify}>Notify!</button>
        <ToastContainer />
            <SideBar />
            <main className='manag_main'>
              {/* <NavBar /> */}
              <Outlet></Outlet>
            </main>
          </div>)
          }
        }
      }else{
            return <Navigate to={'/login'} />
          }
      }
      
export default ManagLayout