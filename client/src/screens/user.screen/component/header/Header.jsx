// import React, { useRef, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import { detacontext } from '../../../../App';
// import './Header.css';
// import Cart from '../cart/Cart';
// import LoginRegistr from '../auth/LoginRegistr';

// const Header = () => {
//   const { id } = useParams();
//   const [opencart, setopencart] = useState(false);
//   const [openlogin, setopenlogin] = useState(false);
//   const navref = useRef();

//   const toggleMobileMenu = () => {
//     navref.current.classList.toggle("show");
//   };

//   return (
//     <detacontext.Consumer>
//       {({ userLoginInfo, logout, ItemsInCart }) => (
//         <header className='header-client'>
//           <div className="container-lg">
//             <div className='logo'>
//               <div className="mob-menu" onClick={toggleMobileMenu}>
//                 <span id='line-1'></span>
//                 <span id='line-2'></span>
//                 <span id='line-3'></span>
//               </div>
//               <Link to="/" className='res-name'>كافيار</Link>
//             </div>
//             <nav ref={navref} className='nav'>
//               <ul className='navigator'>
//                 <li onClick={toggleMobileMenu}><Link to="/">الرئيسيه</Link></li>
//                 <li onClick={toggleMobileMenu}><Link to="#menu">قائمة الطعام</Link></li>
//                 <li onClick={toggleMobileMenu}><Link to="#offer">العروض</Link></li>
//                 <li onClick={toggleMobileMenu}><Link to="#location">موقعنا</Link></li>
//                 <li onClick={toggleMobileMenu}><Link to="#contact">تواصل معنا</Link></li>
//               </ul>
//             </nav>
//             <div className='right-nav'>
//               {!id && (
//                 <>
//                   {userLoginInfo && userLoginInfo.userinfo ? (
//                     <div className="nav-logout" onClick={logout}> خروج
//                       <span className="material-symbols-outlined">logout</span>
//                     </div>
//                   ) : (
//                     <div className='nav-login' onClick={() => setopenlogin(!openlogin)}>دخول<span className="material-symbols-outlined">
//                       login
//                     </span></div>
//                   )}
//                 </>
//               )}
//               <div className='cart-icon' onClick={() => setopencart(!opencart)}>
//                 <span className="material-symbols-rounded shopping_cart">shopping_cart</span>
//                 <span className='cartcounter'>{ItemsInCart.length}</span>
//               </div>
//               <LoginRegistr openlogin={openlogin} />
//               <Cart opencart={opencart} />
//             </div>
//           </div>
//         </header>
//       )}
//     </detacontext.Consumer>
//   );
// };

// export default Header;
import React, { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { detacontext } from '../../../../App';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Cart from '../cart/Cart';
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
        <Navbar expand="lg" className='header-client'>
          <div className="container-lg">
            <Navbar.Brand>
              <Link to="/" className='res-name'>كافيار</Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleMobileMenu} />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/">الرئيسيه</Nav.Link>
                <Nav.Link href="#menu">قائمة الطعام</Nav.Link>
                <Nav.Link href="#offer">العروض</Nav.Link>
                <Nav.Link href="#location">موقعنا</Nav.Link>
                <Nav.Link href="#contact">تواصل معنا</Nav.Link>
              </Nav>
              <Nav className="ml-auto">
                {!id && (
                  <>
                    {userLoginInfo && userLoginInfo.userinfo ? (
                      <Nav.Link onClick={logout}>خروج</Nav.Link>
                    ) : (
                      <Nav.Link onClick={() => setopenlogin(!openlogin)}>دخول</Nav.Link>
                    )}
                  </>
                )}
                <div className='cart-icon' onClick={() => setopencart(!opencart)}>
                  <span className="material-symbols-rounded shopping_cart">shopping_cart</span>
                  <span className='cartcounter'>{ItemsInCart.length}</span>
                </div>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Navbar>
      )}
    </detacontext.Consumer>
  );
};

export default Header;
