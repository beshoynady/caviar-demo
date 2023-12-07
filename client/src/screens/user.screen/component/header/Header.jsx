import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useState, useRef } from 'react';
import { detacontext } from '../../../../App';
import LoginRegistr from '../auth/LoginRegistr';

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
        <header className="bg-gradient">
          <div className="container-lg">
            <div className="row align-items-center">
              <div className="col-md-6 col-8">
                <div className="logo">
                  <div className="mob-menu" onClick={toggleMobileMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <Link to="/" className="res-name">كافيار</Link>
                </div>
              </div>
              <div className="col-md-6 col-4 text-end">
                <nav ref={navref} className="nav">
                  <ul className="navigator">
                    <li onClick={toggleMobileMenu}><Link to="/">الرئيسيه</Link></li>
                    <li onClick={toggleMobileMenu}><Link to="#menu">قائمة الطعام</Link></li>
                    <li onClick={toggleMobileMenu}><Link to="#offer">العروض</Link></li>
                    <li onClick={toggleMobileMenu}><Link to="#location">موقعنا</Link></li>
                    <li onClick={toggleMobileMenu}><Link to="#contact">تواصل معنا</Link></li>
                  </ul>
                </nav>
                <div className="right-nav">
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
            </div>
          </div>
        </header>
      )}
    </detacontext.Consumer>
  );
};

export default Header;

