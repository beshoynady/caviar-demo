import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useState, useRef } from 'react';
import { detacontext } from '../../../../App';
import LoginRegistr from '../auth/LoginRegistr';
import Cart from '../cart/Cart';
import { Button } from 'react-bootstrap'; // Import Bootstrap Button component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Assuming you're using FontAwesome for icons
import { faSignInAlt, faSignOutAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons'; // Import required icons
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Header = () => {
  const { id } = useParams();
  const [opencart, setopencart] = useState(false);
  const [openlogin, setopenlogin] = useState(false);
  const [showNav, setShowNav] = useState(false); // State to toggle mobile nav
  const navref = useRef();

  const toggleMobileMenu = () => {
    setShowNav(!showNav);
  };

  const { userLoginInfo, logout, ItemsInCart } = useContext(detacontext); // Using useContext hook to access context

  return (
    <header>
      <div className="container">
        <div className="row align-items-center justify-content-between">
          <div className="col-6 col-md-4">
            <div onClick={toggleMobileMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <Link to="/">كافيار</Link>
          </div>
          <div className="col-6 col-md-8">
            <nav ref={navref} className={showNav ? 'show' : 'hide'}>
              <ul>
                <li onClick={toggleMobileMenu}>
                  <Link to="/">الرئيسيه</Link>
                </li>
                <li onClick={toggleMobileMenu}>
                  <Link to="#menu">قائمة الطعام</Link>
                </li>
                <li onClick={toggleMobileMenu}>
                  <Link to="#offer">العروض</Link>
                </li>
                <li onClick={toggleMobileMenu}>
                  <Link to="#location">موقعنا</Link>
                </li>
                <li onClick={toggleMobileMenu}>
                  <Link to="#contact">تواصل معنا</Link>
                </li>
              </ul>
            </nav>
            <div>
              {!id && (
                <>
                  {userLoginInfo && userLoginInfo.userinfo ? (
                    <Button variant="primary" onClick={logout}>
                      خروج <FontAwesomeIcon icon={faSignOutAlt} />
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={() => setopenlogin(!openlogin)}>
                      دخول <FontAwesomeIcon icon={faSignInAlt} />
                    </Button>
                  )}
                </>
              )}
              <Button variant="primary" onClick={() => setopencart(!opencart)}>
                <FontAwesomeIcon icon={faShoppingCart} />{' '}
                <span>{ItemsInCart.length}</span>
              </Button>
              <LoginRegistr openlogin={openlogin} />
              <Cart opencart={opencart} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
