import React from 'react'
import './NavBar.css'
import { detacontext } from '../../../../App'
import { Link } from 'react-router-dom'


const NavBar = () => {
  return (
    <detacontext.Consumer>
      {
        ({userlogininfo, employeelogout }) => {
          return (
            <header className='manag-header'>
              <div className='container'>
                <nav className='manag-nav'>
                  <div className="profile">
                    <div className="info">
                      <p>اهلا, <b>{userlogininfo && userlogininfo.employeeinfo ? userlogininfo.employeeinfo.username :''}</b></p>
                    </div>
                    <div className="logout-btn">
                      <a href='/login' onClick={employeelogout}>خروج</a>
                    </div>
                  </div>

                </nav>
              </div>
            </header>
          )
        }
      }
    </detacontext.Consumer>
  )
}

export default NavBar