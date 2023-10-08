import React, {useState, useEffect} from 'react';
import './ManagLayout.css'
import { detacontext } from '../../App'
import { Navigate, Outlet } from 'react-router-dom';
import NavBar from './manag.component/navbar/NavBar';
import SideBar from './manag.component/sidebar/SideBar';
import jwt_decode from "jwt-decode";



const ManagLayout = () => {

    if (localStorage.getItem('token')) {
      // console.log(localStorage.getItem('token'))
      const tokenStorage = localStorage.getItem('token')
      if (tokenStorage) {
        const decodetoken = jwt_decode(tokenStorage)
       if(decodetoken.userinfo.isAdmin){
        return(
          <div className='manag-screen'>
            <SideBar />
            <main className='manag_main'>
              <NavBar />
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