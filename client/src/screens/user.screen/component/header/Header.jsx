import './Header.css';
import Cart from '../cart/Cart';
import LoginRegistr from '../auth/LoginRegistr';
import React, { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { detacontext } from '../../../../App';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <header className='bg-primary py-3'>
          <div className="container-lg d-flex justify-content-between align-items-center">
            <div className='logo d-flex align-items-center'>
              <div className="mob-menu d-lg-none" onClick={toggleMobileMenu}>
                <span className="bg-dark rounded p-1"></span>
                <span className="bg-dark rounded p-1 mt-1"></span>
                <span className="bg-dark rounded p-1 mt-1"></span>
              </div>
              <Link to="/" className='text-gold text-decoration-none fs-3 fw-bold'>كافيار</Link>
            </div>
            <nav ref={navref} className='d-lg-block'>
              <ul className='list-unstyled d-flex justify-content-between m-0'>
                <li onClick={toggleMobileMenu}><Link to="/" className="text-white text-decoration-none">الرئيسيه</Link></li>
                <li onClick={toggleMobileMenu}><Link to="#menu" className="text-white text-decoration-none">قائمة الطعام</Link></li>
                <li onClick={toggleMobileMenu}><Link to="#offer" className="text-white text-decoration-none">العروض</Link></li>
                <li onClick={toggleMobileMenu}><Link to="#location" className="text-white text-decoration-none">موقعنا</Link></li>
                <li onClick={toggleMobileMenu}><Link to="#contact" className="text-white text-decoration-none">تواصل معنا</Link></li>
              </ul>
            </nav>
            <div className='right-nav d-flex align-items-center'>
              {!id && (
                <>
                  {userLoginInfo && userLoginInfo.userinfo ? (
                    <div className="bg-danger text-white px-2 py-1 rounded cursor-pointer" onClick={logout}>
                      خروج
                      <span className="text-white">logout</span>
                    </div>
                  ) : (
                    <div className='bg-light text-dark px-2 py-1 rounded cursor-pointer' onClick={() => setopenlogin(!openlogin)}>
                      دخول
                      <span>
                        login
                      </span>
                    </div>
                  )}
                </>
              )}
              <div className='cart-icon position-relative' onClick={() => setopencart(!opencart)}>
                <span className="text-white fs-4">shopping_cart</span>
                <span className='bg-danger text-white rounded-circle d-flex align-items-center justify-content-center fw-bold'>{ItemsInCart.length}</span>
              </div>
              {/* Include LoginRegistr and Cart components here */}
            </div>
          </div>
        </header>
      )}
    </detacontext.Consumer>
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
