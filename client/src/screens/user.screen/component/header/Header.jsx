import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Header = () => {
  const [showNav, setShowNav] = useState(false);

  const toggleMobileMenu = () => {
    setShowNav(!showNav);
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            كافيار
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMobileMenu}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse ${
              showNav ? 'show' : ''
            }`}
          >
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
            <div className="d-flex align-items-center">
              <Link className="btn btn-primary me-3" to="/login">
                تسجيل الدخول
              </Link>
              <Link className="btn btn-outline-primary me-3" to="/signup">
                إنشاء حساب
              </Link>
              <Link className="btn btn-outline-primary position-relative" to="/cart">
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  5 {/* Replace with dynamic cart count */}
                </span>
                <i className="bi bi-cart"></i>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
