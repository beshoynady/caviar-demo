import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useState, useRef } from 'react';
import { detacontext } from '../../../../App';
import LoginRegistr from '../auth/LoginRegistr';
import Cart from '../cart/Cart';

const Header = () => {
  const { id } = useParams();
  const [opencart, setopencart] = useState(false);
  const [openlogin, setopenlogin] = useState(false);
  const navref = useRef();

  const toggleMobileMenu = () => {
    navref.current.classList.toggle("show");
  };

  return (
    <detacontext.Consumer>
      {({ userLoginInfo, logout, ItemsInCart }) => (
        <header>
          <div>
            <div>
              <div onClick={toggleMobileMenu}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <Link to="/">كافيار</Link>
            </div>
            <nav ref={navref}>
              <ul>
                <li onClick={toggleMobileMenu}><Link to="/">الرئيسيه</Link></li>
                <li onClick={toggleMobileMenu}><Link to="#menu">قائمة الطعام</Link></li>
                <li onClick={toggleMobileMenu}><Link to="#offer">العروض</Link></li>
                <li onClick={toggleMobileMenu}><Link to="#location">موقعنا</Link></li>
                <li onClick={toggleMobileMenu}><Link to="#contact">تواصل معنا</Link></li>
              </ul>
            </nav>
            <div>
              {!id && (
                <>
                  {userLoginInfo && userLoginInfo.userinfo ? (
                    <div onClick={logout}> خروج
                      <span>logout</span>
                    </div>
                  ) : (
                    <div onClick={() => setopenlogin(!openlogin)}>دخول<span>
                      login
                    </span></div>
                  )}
                </>
              )}
              <div onClick={() => setopencart(!opencart)}>
                <span>shopping_cart</span>
                <span>{ItemsInCart.length}</span>
              </div>
              <LoginRegistr openlogin={openlogin} />
              <Cart opencart={opencart} />
            </div>
          </div>
        </header>
      )}
    </detacontext.Consumer>
  );
};


export default Header;

