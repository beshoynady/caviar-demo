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
        <header className="bg-gradient">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-8 col-6">
                <div className="logo">
                  <div className="mob-menu" onClick={toggleMobileMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <Link to="/" className="res-name">كافيار</Link>
                </div>
              </div>
              <div className="col-lg-6 col-md-4 col-6 text-end">
                <nav ref={navref} className="nav" style={{ display: 'none' }}>
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
                        <div onClick={logout} className="cursor-pointer text-white"> خروج</div>
                      ) : (
                        <div onClick={() => setopenlogin(!openlogin)} className="cursor-pointer text-white">دخول</div>
                      )}
                    </>
                  )}
                  <div onClick={() => setopencart(!opencart)} className="cursor-pointer text-white position-relative ms-3">
                    <span className="me-2">shopping_cart</span>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {ItemsInCart.length}
                      <span className="visually-hidden">عناصر في السلة</span>
                    </span>
                  </div>
                  {/* اضف LoginRegistr و Cart هنا */}
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

