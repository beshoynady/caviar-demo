import React, { useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { detacontext } from '../../../../App'


import './Header.css'
import Cart from '../cart/Cart'
import LoginRegistr from '../auth/LoginRegistr';


const Header = () => {
  const { id } = useParams()

  const [opencart, setopencart] = useState(false)
  const [openlogin, setopenlogin] = useState(false)
  const [openlogout, setlogout] = useState(false)
  const navref = useRef()
  const openmobmenu = () => {
    navref.current.classList.toggle(
      "show");
  }


  return (
    <detacontext.Consumer>
      {
        ({ usertitle, userlogininfo, logout }) => {
          return (
            <header className='header-client'>
              <div className="container container-lg">

                <div className='logo'>
                  <div className="mob-menu" onClick={() => { openmobmenu() }}>
                    <span id='line-1'></span>
                    <span id='line-2'></span>
                    <span id='line-3'></span>
                  </div>
                  <a href="#" className='res-name'>كافيار</a>
                </div>
                <nav ref={navref}>
                  <ul className='navigator'>
                    <li onClick={() => { openmobmenu() }}><a href="#">الرئيسيه </a></li>
                    <li onClick={() => { openmobmenu() }}><a href="#menu">قائمة الطعام</a></li>
                    <li onClick={() => { openmobmenu() }}><a href="#offer">العروض</a></li>
                    <li onClick={() => { openmobmenu() }}><a href="#location">موقعنا</a></li>
                    <li onClick={() => { openmobmenu() }}><a href="#contact">تواصل معنا</a></li>
                  </ul>
                </nav>
                <div className='right-nav'>
                  {id?''
                    :userlogininfo ? <div className="nav-logout" onClick={logout}> خروج
                        <span className="material-symbols-outlined">logout</span>
                        </div>
                        : <div className='nav-login' onClick={(e) => { e.preventDefault(); setopenlogin(!openlogin) }}>دخول<span className="material-symbols-outlined">
                          login
                        </span></div>
                        }
                  <div className='cart-icon' onClick={(e) => { e.preventDefault(); setopencart(!opencart) }}>
                    <span className="material-symbols-rounded">shopping_cart</span></div>
                  <LoginRegistr openlogin={openlogin} />
                  <Cart opencart={opencart} />

                </div>
              </div>

            </header>
          )
        }
      }
    </detacontext.Consumer>
  )

}

export default Header