import React, { useRef, useEffect } from 'react';
import './SideBar.css';
import { detacontext } from '../../../../App'
import { Link } from 'react-router-dom'

const SideBar = () => {
  // const menuitem = [
  //   { title: 'الرئسيه', sideitem: 'dashboard', icon: "dashboard" },
  //   { title: 'POS', sideitem: 'pos', icon: "point_of_sale" },
  //   { title: 'الويتر', sideitem: 'waiter', icon: "directions_run" },
  //   { title: 'المطبخ', sideitem: 'kitchen', icon: "set_meal" },
  //   { title: 'الطلبات', sideitem: 'orders', icon: "list_alt" },
  //   { title: 'الطاولة', sideitem: 'tables', icon: "table_restaurant" },

  //   { title: 'التصنيفات', sideitem: 'category', icon: "category" },
  //   { title: 'المنتجات', sideitem: 'products', icon: "restaurant" },
  //   { title: 'التكاليف', sideitem: 'productrecipe', icon: "restaurant" },

  //   { title: 'الموظفين', sideitem: 'employees', icon: "group_add" },
  //   { title: 'المرتبات', sideitem: 'employeessalary', icon: "group_add" },
  //   { title: 'payrole', sideitem: 'payrole', icon: "group_add" },

  //   { title: 'تصنيفات المخزون', sideitem: 'categoryStock', icon: "category" },
  //   { title: 'اصناف المخزن', sideitem: 'stockitem', icon: "inventory_2" },
  //   { title: 'ادارة المخزون', sideitem: 'stockmang', icon: "inventory" },
  // ]


  // const opensidebar = () => {
  //   sidebar.current.classList.toggle("toggle-width")
  //   menuicon.current.classList.toggle("rotate")
  // }
  const openarrowmen = () => {
    arrowmen.current.classList.toggle("showMenu")
  }
  const openarrowemp = () => {
    arrowemp.current.classList.toggle("showMenu")
  }
  const openarrowsto = () => {
    arrowsto.current.classList.toggle("showMenu")
  }
  const openarrowsexp = () => {
    arrowsexp.current.classList.toggle("showMenu")
  }
  const opensidebar = () => {
    sidebar.current.classList.toggle("close")
  }

  const arrowmen = useRef()
  const arrowemp = useRef()
  const arrowsto = useRef()
  const arrowsexp = useRef()
  const sidebar = useRef()
  const menuicon = useRef()

  return (
    <detacontext.Consumer>
      {
        ({ userlogininfo, employeelogout }) => {
          return (
            <>
              <div ref={sidebar} className="sidebar close">
                <div className="logo-details">
                  <i className='bx bxl-c-plus-plus'></i>
                  <span className="logo_name">CAVIAR</span>
                </div>
                <ul className="nav-links">
                  <li>
                    <Link to="/management">
                      <span class="material-symbols-outlined icon">
                        dashboard
                      </span>
                      <span className="link_name">Dashboard</span>
                    </Link>
                    <ul className="sub-menu blank">
                      <li><Link to="/" className="link_name">Dashboard</Link></li>
                    </ul>
                  </li>
                  <li>
                    <Link to="pos">
                      {/* <i className='bx bx-grid-alt' ></i> */}
                      <span class="material-symbols-outlined icon">
                        point_of_sale
                      </span>
                      <span className="link_name">POS</span>
                    </Link>
                    <ul className="sub-menu blank">
                      <li><Link to="pos" className="link_name">POS</Link></li>
                    </ul>
                  </li>
                  <li>
                    <Link to="waiter">
                      {/* <i className='bx bx-grid-alt' ></i> */}
                      <span class="material-symbols-outlined icon">
                        concierge
                      </span>
                      <span className="link_name">الويتر</span>
                    </Link>
                    <ul className="sub-menu blank">
                      <li><Link to="waiter" className="link_name">الويتر</Link></li>
                    </ul>
                  </li>
                  <li>
                    <Link to="kitchen">
                      {/* <i className='bx bx-grid-alt' ></i> */}
                      <span class="material-symbols-outlined icon">
                        cooking
                      </span>
                      <span className="link_name">المطبخ</span>
                    </Link>
                    <ul className="sub-menu blank">
                      <li><Link to="kitchen" className="link_name">المطبخ</Link></li>
                    </ul>
                  </li>
                  <li>
                    <Link to="orders">
                      {/* <i className='bx bx-grid-alt' ></i> */}
                      <span class="material-symbols-outlined icon">
                        list_alt
                      </span>
                      <span className="link_name">الاوردرات</span>
                    </Link>
                    <ul className="sub-menu blank">
                      <li><Link to="orders" className="link_name">الاوردرات</Link></li>
                    </ul>
                  </li>
                  <li>
                    <Link to="tables">
                      {/* <i className='bx bx-grid-alt' ></i> */}
                      <span class="material-symbols-outlined icon">
                        table_restaurant
                      </span>
                      <span className="link_name">الطاولة</span>
                    </Link>
                    <ul className="sub-menu blank">
                      <li><Link to="tables" className="link_name">الطاولة</Link></li>
                    </ul>
                  </li>

                  <li ref={arrowmen} onClick={openarrowmen}>
                    <div className="iocn-link">
                      <a href="#">
                        <span class="material-symbols-outlined icon">
                          restaurant_menu
                        </span>
                        <span className="link_name">المنيو</span>
                      </a>
                      <i className='bx bxs-chevron-down arrow' ></i>
                    </div>
                    <ul className="sub-menu">
                      <li><a className="link_name" href="#">المنيو</a></li>
                      <li><Link to="category">التصنيفات</Link></li>
                      <li><Link to="products">الاطباق</Link></li>
                      <li><Link to="productrecipe">التكاليف</Link></li>
                    </ul>
                  </li>

                  <li ref={arrowemp} onClick={openarrowemp}>
                    <div className="iocn-link">
                      <a href="#">
                        <span class="material-symbols-outlined icon">
                          group_add
                        </span>
                        <span className="link_name">الموظفون</span>
                      </a>
                      <i className='bx bxs-chevron-down arrow' ></i>
                    </div>
                    <ul className="sub-menu">
                      <li><a className="link_name" href="#">الموظفون</a></li>
                      <li><Link to="employees">البيانات</Link></li>
                      <li><Link to="employeessalary">تعاملات</Link></li>
                      <li><Link to="payroll">المرتبات</Link></li>
                    </ul>
                  </li>

                  <li ref={arrowsto} onClick={openarrowsto}>
                    <div className="iocn-link">
                      <a href="#">
                        <span class="material-symbols-outlined icon">
                          receipt_long
                        </span>
                        <span className="link_name">المخزن</span>
                      </a>
                      <i className='bx bxs-chevron-down arrow' ></i>
                    </div>
                    <ul className="sub-menu">
                      <li><a className="link_name" href="#">المخزن</a></li>
                      <li><Link to="categoryStock">تصنيفات</Link></li>
                      <li><Link to="stockitem">الاصناف</Link></li>
                      <li><Link to="stockmang">حركه المخزن</Link></li>
                    </ul>
                  </li>
                  <li ref={arrowsto} onClick={openarrowsexp}>
                    <div className="iocn-link">
                      <a href="#">
                        <span class="material-symbols-outlined arrow">
                          request_page
                        </span>
                        <span className="link_name">المصروفات</span>
                      </a>
                      <i className='bx bxs-chevron-down arrow' ></i>
                    </div>
                    <ul className="sub-menu">
                      <li><a className="link_name" href="#">المصروفات</a></li>
                      <li><Link to="expense">المصروفات</Link></li>
                      <li><Link to="dailyexpense">تسجيل مصروف</Link></li>
                      {/* {/* <li><Link to="stockitem"></Link></li> */}
                    </ul>
                  </li>

                  {/* <li ref={arrow} onClick={openarrow}>
            <div className="iocn-link">
              <a href="#">
                <i className='bx bx-collection' ></i>
                <span className="link_name">المنيو</span>
              </a>
              <i className='bx bxs-chevron-down arrow' ></i>
            </div>
            <ul className="sub-menu">
              <li><a className="link_name" href="#">المنيو</a></li>
              <li><Link to="category">التصنيفات</Link></li>
              <li><Link to="products">الاطباق</Link></li>
              <li><Link to="productrecipe">التكاليف</Link></li>
            </ul>
          </li>
          <li ref={arrow} onClick={openarrow}>
            <div className="iocn-link">
              <a href="#">
                <i className='bx bx-collection' ></i>
                <span className="link_name">المنيو</span>
              </a>
              <i className='bx bxs-chevron-down arrow' ></i>
            </div>
            <ul className="sub-menu">
              <li><a className="link_name" href="#">المنيو</a></li>
              <li><Link to="category">التصنيفات</Link></li>
              <li><Link to="products">الاطباق</Link></li>
              <li><Link to="productrecipe">التكاليف</Link></li>
            </ul>
          </li>
          <li>
            <div className="iocn-link" ref={arrow} onClick={openarrow}>
              <a href="#">
                <i className='bx bx-book-alt' ></i>
                <span className="link_name">Posts</span>
              </a>
              <i className='bx bxs-chevron-down arrow' ></i>
            </div>
            <ul className="sub-menu">
              <li><a className="link_name" href="#">Posts</a></li>
              <li><a href="#">Web Design</a></li>
              <li><a href="#">Login Form</a></li>
              <li><a href="#">Card Design</a></li>
            </ul>
          </li>
          <li>
            <a href="#">
              <i className='bx bx-pie-chart-alt-2' ></i>
              <span className="link_name">Analytics</span>
            </a>
            <ul className="sub-menu blank">
              <li><a className="link_name" href="#">Analytics</a></li>
            </ul>
          </li>
          <li>
            <a href="#">
              <i className='bx bx-line-chart' ></i>
              <span className="link_name">Chart</span>
            </a>
            <ul className="sub-menu blank">
              <li><a className="link_name" href="#">Chart</a></li>
            </ul>
          </li>
          <li>
            <div className="iocn-link">
              <a href="#">
                <i className='bx bx-plug' ></i>
                <span className="link_name">Plugins</span>
              </a>
              <i className='bx bxs-chevron-down arrow' ></i>
            </div>
            <ul className="sub-menu">
              <li><a className="link_name" href="#">Plugins</a></li>
              <li><a href="#">UI Face</a></li>
              <li><a href="#">Pigments</a></li>
              <li><a href="#">Box Icons</a></li>
            </ul>
          </li>
          <li>
            <a href="#">
              <i className='bx bx-compass' ></i>
              <span className="link_name">Explore</span>
            </a>
            <ul className="sub-menu blank">
              <li><a className="link_name" href="#">Explore</a></li>
            </ul>
          </li>
          <li>
            <a href="#">
              <i className='bx bx-history'></i>
              <span className="link_name">History</span>
            </a>
            <ul className="sub-menu blank">
              <li><a className="link_name" href="#">History</a></li>
            </ul>
          </li>
          <li>
            <a href="#">
              <i className='bx bx-cog' ></i>
              <span className="link_name">Setting</span>
            </a>
            <ul className="sub-menu blank">
              <li><a className="link_name" href="#">Setting</a></li>
            </ul>
          </li> */}
                  <li>
                    <div className="profile-details">
                      <div className="profile-content">
                        <i className='bx bx-log-out' onClick={employeelogout}></i>
                        {/* <img src="https://gravatar.com/avatar/f57bddebd1edf91412d5d68702530099" alt="profileImg" /> */}
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