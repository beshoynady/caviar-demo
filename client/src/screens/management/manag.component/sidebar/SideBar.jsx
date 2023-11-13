import React, { useRef } from 'react';
import './SideBar.css';
import { detacontext } from '../../../../App';
import { Link } from 'react-router-dom';

const SideBar = () => {
  const arrowRefs = {
    arrowmen: useRef(),
    arrowemp: useRef(),
    arrowsto: useRef(),
    arrowsexp: useRef(),
  };

  const sidebarRef = useRef();

  const openSubMenu = (arrowRef) => {
    arrowRef.current.classList.toggle('showMenu');
  };

  const openSidebar = () => {
    sidebarRef.current.classList.toggle('close');
  };

  return (
    <detacontext.Consumer>
      {
        ({ userlogininfo, employeelogout }) => {
          return (
            <>
            <div ref={sidebarRef} className="sidebar close">
              <div className="logo-details">
                <i className='bx bxl-c-plus-plus'></i>
                <span className="logo_name">CAVIAR</span>
              </div>
              <ul className="nav-links">
                {/* Dashboard */}
                <li>
                  <Link to="/management">
                    <span className="material-symbols-outlined icon">dashboard</span>
                    <span className="link_name">Dashboard</span>
                  </Link>
                  <ul className="sub-menu blank">
                    <li><Link to="/" className="link_name">Dashboard</Link></li>
                  </ul>
                </li>
  
                {/* POS */}
                <li>
                  <Link to="pos">
                    <span className="material-symbols-outlined icon">point_of_sale</span>
                    <span className="link_name">POS</span>
                  </Link>
                  <ul className="sub-menu blank">
                    <li><Link to="pos" className="link_name">POS</Link></li>
                  </ul>
                </li>
  
                {/* Waiter */}
                <li>
                  <Link to="waiter">
                    <span className="material-symbols-outlined icon">concierge</span>
                    <span className="link_name">الويتر</span>
                  </Link>
                  <ul className="sub-menu blank">
                    <li><Link to="waiter" className="link_name">الويتر</Link></li>
                  </ul>
                </li>
  
                {/* Kitchen */}
                <li>
                  <Link to="kitchen">
                    <span className="material-symbols-outlined icon">cooking</span>
                    <span className="link_name">المطبخ</span>
                  </Link>
                  <ul className="sub-menu blank">
                    <li><Link to="kitchen" className="link_name">المطبخ</Link></li>
                  </ul>
                </li>
  
                {/* Orders */}
                <li>
                  <Link to="orders">
                    <span className="material-symbols-outlined icon">list_alt</span>
                    <span className="link_name">الاوردرات</span>
                  </Link>
                  <ul className="sub-menu blank">
                    <li><Link to="orders" className="link_name">الاوردرات</Link></li>
                  </ul>
                </li>
  
                {/* Tables */}
                <li>
                  <Link to="tables">
                    <span className="material-symbols-outlined icon">table_restaurant</span>
                    <span className="link_name">الطاولة</span>
                  </Link>
                  <ul className="sub-menu blank">
                    <li><Link to="tables" className="link_name">الطاولة</Link></li>
                  </ul>
                </li>
  
                {/* Menu */}
                <li ref={arrowRefs.arrowmen} onClick={() => openSubMenu(arrowRefs.arrowmen)}>
                  <div className="iocn-link">
                    <a href="#">
                      <span className="material-symbols-outlined icon">restaurant_menu</span>
                      <span className="link_name">المنيو</span>
                    </a>
                    <i className='bx bxs-chevron-down arrow'></i>
                  </div>
                  <ul className="sub-menu">
                    <li><a className="link_name" href="#">المنيو</a></li>
                    <li><Link to="category">التصنيفات</Link></li>
                    <li><Link to="products">الاطباق</Link></li>
                    <li><Link to="productrecipe">التكاليف</Link></li>
                  </ul>
                </li>
  
                {/* Employees */}
                <li ref={arrowRefs.arrowemp} onClick={() => openSubMenu(arrowRefs.arrowemp)}>
                  <div className="iocn-link">
                    <a href="#">
                      <span className="material-symbols-outlined icon">group_add</span>
                      <span className="link_name">الموظفون</span>
                    </a>
                    <i className='bx bxs-chevron-down arrow'></i>
                  </div>
                  <ul className="sub-menu">
                    <li><a className="link_name" href="#">الموظفون</a></li>
                    <li><Link to="employees">البيانات</Link></li>
                    <li><Link to="employeessalary">تعاملات</Link></li>
                    <li><Link to="payroll">المرتبات</Link></li>
                  </ul>
                </li>
  
                {/* Stock */}
                <li ref={arrowRefs.arrowsto} onClick={() => openSubMenu(arrowRefs.arrowsto)}>
                  <div className="iocn-link">
                    <a href="#">
                      <span className="material-symbols-outlined icon">receipt_long</span>
                      <span className="link_name">المخزن</span>
                    </a>
                    <i className='bx bxs-chevron-down arrow'></i>
                  </div>
                  <ul className="sub-menu">
                    <li><a className="link_name" href="#">المخزن</a></li>
                    <li><Link to="categoryStock">تصنيفات</Link></li>
                    <li><Link to="stockitem">الاصناف</Link></li>
                    <li><Link to="stockmang">حركه المخزن</Link></li>
                  </ul>
                </li>
  
                {/* Expenses */}
                <li ref={arrowRefs.arrowsexp} onClick={() => openSubMenu(arrowRefs.arrowsexp)}>
                  <div className="iocn-link">
                    <a href="#">
                      <span className="material-symbols-outlined arrow icon">request_page</span>
                      <span className="link_name">المصروفات</span>
                    </a>
                    <i className='bx bxs-chevron-down arrow'></i>
                  </div>
                  <ul className="sub-menu">
                    <li><a className="link_name" href="#">المصروفات</a></li>
                    <li><Link to="expense">المصروفات</Link></li>
                    <li><Link to="dailyexpense">تسجيل مصروف</Link></li>
                  </ul>
                </li>
                  <li>
                    <div className="profile-details">
                      <div className="profile-content">
                        <i className='bx bx-log-out' onClick={employeelogout}></i>
                      </div>
                      <div className="name-job">
                        <div className="profile_name">{userlogininfo ? userlogininfo.employeeinfo.username : ''}</div>
                        <div className="job">{userlogininfo ? userlogininfo.employeeinfo.role : ''}</div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <section className="home-section" onClick={opensidebar}>
                <div className="home-content">
                  <i className='bx bx-menu' ></i>
                </div>
              </section>
            </>
            // <div ref={sidebar} className='sidebar'>
            //   <div className='menu'>
            //     <div className="logo">
            //       <h2>كافيار</h2>
            //       <span ref={menuicon} className="material-symbols-outlined icon menu-icon" onClick={opensidebar}>menu_open</span>
            //     </div>
            //     <div className='sid-list'>
            //       {menuitem.map((item, i) => {
            //         return (
            //           <Link to={item.sideitem != 'dashboard' ? item.sideitem : ''} className='item' key={i}>
            //             <span className="material-symbols-outlined icon icon-manag">{item.icon}</span>
            //             <p className='menu-title'>{item.title}</p>
            //           </Link>
            //         )
            //       })
            //       }
            //     </div>
            //   </div>
            // </div>
          )
        }
      }
    </detacontext.Consumer>
  )

}

export default SideBar