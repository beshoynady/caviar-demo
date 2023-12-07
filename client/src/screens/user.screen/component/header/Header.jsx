import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { detacontext } from '../../../../App';

const Header = () => {
  const [showNav, setShowNav] = useState(false);
  const { userLoginInfo, logout, ItemsInCart } = useContext(detacontext);

  const toggleMobileMenu = () => {
    setShowNav(!showNav);
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand mx-auto" to="/">
            كافيار
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMobileMenu}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>
      <div className={`collapse navbar-collapse ${showNav ? 'show' : ''}`}>
        <div className="container">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                الرئيسية
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#menu">
                قائمة الطعام
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#offer">
                العروض
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#location">
                موقعنا
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#contact">
                تواصل معنا
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between py-3">
          <div className="d-lg-none">
            <Link className="me-3" to="/login">
              تسجيل الدخول
            </Link>
            <Link className="me-3" to="/cart">
              <i className="bi bi-cart"></i>
            </Link>
          </div>
          <div className="d-none d-lg-flex align-items-center">
            <Link className="btn btn-primary me-3" onClick={logout}>
              تسجيل الخروج
            </Link>
            <Link className="btn btn-outline-primary me-3" to="/cart">
              <i className="bi bi-cart"></i>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;






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
