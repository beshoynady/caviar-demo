import React, { useRef, useEffect } from 'react';
import './SideBar.css';
import { Link } from 'react-router-dom'

const SideBar = () => {
  const menuitem = [
    { title: 'الرئسيه', sideitem: 'dashboard', icon: "dashboard" },
    { title: 'POS', sideitem: 'pos', icon: "point_of_sale" },
    { title: 'الويتر', sideitem: 'waiter', icon: "directions_run" },
    { title: 'المطبخ', sideitem: 'kitchen', icon: "set_meal" },
    { title: 'الطلبات', sideitem: 'orders', icon: "list_alt" },
    { title: 'الطاولة', sideitem: 'tables', icon: "table_restaurant" },

    { title: 'التصنيفات', sideitem: 'category', icon: "category" },
    { title: 'المنتجات', sideitem: 'products', icon: "restaurant" },
    { title: 'التكاليف', sideitem: 'productrecipe', icon: "restaurant" },

    { title: 'الموظفين', sideitem: 'employees', icon: "group_add" },
    { title: 'المرتبات', sideitem: 'employeessalary', icon: "group_add" },
    { title: 'payrole', sideitem: 'payrole', icon: "group_add" },

    { title: 'تصنيفات المخزون', sideitem: 'categoryStock', icon: "category" },
    { title: 'اصناف المخزن', sideitem: 'stockitem', icon: "inventory_2" },
    { title: 'ادارة المخزون', sideitem: 'stockmang', icon: "inventory" },
  ]


  // const opensidebar = () => {
  //   sidebar.current.classList.toggle("toggle-width")
  //   menuicon.current.classList.toggle("rotate")
  // }
  const openarrow = () => {
    arrow.current.classList.toggle("showMenu")
  }
  const opensidebar = () => {
    sidebar.current.classList.toggle("close")
  }

  const arrow = useRef()
  const sidebar = useRef()
  const menuicon = useRef()

  useEffect(() => {
  }, [])

  return (
    <>
    <div ref={sidebar} class="sidebar close">
    <div class="logo-details">
      <i class='bx bxl-c-plus-plus'></i>
      <span class="logo_name">CodingLab</span>
    </div>
    <ul class="nav-links">
      <li>
        <a href="#">
          <i class='bx bx-grid-alt' ></i>
          <span class="link_name">Dashboard</span>
        </a>
        <ul class="sub-menu blank">
          <li><a class="link_name" href="#">Category</a></li>
        </ul>
      </li>
      <li ref={arrow} class="active" onClick={openarrow}>
        <div class="iocn-link">
          <a href="#">
            <i class='bx bx-collection' ></i>
            <span class="link_name">Category</span>
          </a>
          <i class='bx bxs-chevron-down arrow' ></i>
        </div>
        <ul class="sub-menu">
          <li><a class="link_name" href="#">Category</a></li>
          <li><a href="#">HTML & CSS</a></li>
          <li><a href="#">JavaScript</a></li>
          <li><a href="#">PHP & MySQL</a></li>
        </ul>
      </li>
      <li>
        <div class="iocn-link">
          <a href="#">
            <i class='bx bx-book-alt' ></i>
            <span class="link_name">Posts</span>
          </a>
          <i class='bx bxs-chevron-down arrow' ></i>
        </div>
        <ul class="sub-menu">
          <li><a class="link_name" href="#">Posts</a></li>
          <li><a href="#">Web Design</a></li>
          <li><a href="#">Login Form</a></li>
          <li><a href="#">Card Design</a></li>
        </ul>
      </li>
      <li>
        <a href="#">
          <i class='bx bx-pie-chart-alt-2' ></i>
          <span class="link_name">Analytics</span>
        </a>
        <ul class="sub-menu blank">
          <li><a class="link_name" href="#">Analytics</a></li>
        </ul>
      </li>
      <li>
        <a href="#">
          <i class='bx bx-line-chart' ></i>
          <span class="link_name">Chart</span>
        </a>
        <ul class="sub-menu blank">
          <li><a class="link_name" href="#">Chart</a></li>
        </ul>
      </li>
      <li>
        <div class="iocn-link">
          <a href="#">
            <i class='bx bx-plug' ></i>
            <span class="link_name">Plugins</span>
          </a>
          <i class='bx bxs-chevron-down arrow' ></i>
        </div>
        <ul class="sub-menu">
          <li><a class="link_name" href="#">Plugins</a></li>
          <li><a href="#">UI Face</a></li>
          <li><a href="#">Pigments</a></li>
          <li><a href="#">Box Icons</a></li>
        </ul>
      </li>
      <li>
        <a href="#">
          <i class='bx bx-compass' ></i>
          <span class="link_name">Explore</span>
        </a>
        <ul class="sub-menu blank">
          <li><a class="link_name" href="#">Explore</a></li>
        </ul>
      </li>
      <li>
        <a href="#">
          <i class='bx bx-history'></i>
          <span class="link_name">History</span>
        </a>
        <ul class="sub-menu blank">
          <li><a class="link_name" href="#">History</a></li>
        </ul>
      </li>
      <li>
        <a href="#">
          <i class='bx bx-cog' ></i>
          <span class="link_name">Setting</span>
        </a>
        <ul class="sub-menu blank">
          <li><a class="link_name" href="#">Setting</a></li>
        </ul>
      </li>
      <li>
    <div class="profile-details">
      <div class="profile-content">
        <img src="https://gravatar.com/avatar/f57bddebd1edf91412d5d68702530099" alt="profileImg"/>
      </div>
      <div class="name-job">
        <div class="profile_name">Dumitru Chirutac</div>
        <div class="job">Web Desginer</div>
      </div>
      <i class='bx bx-log-out' ></i>
    </div>
  </li>
</ul>
  </div>
  <section class="home-section" onClick={opensidebar}>
    <div class="home-content">
      <i class='bx bx-menu' ></i>
      <span class="text">Drop Down Sidebar</span>
    </div>
  </section>
    </>
    // <div ref={sidebar} className='sidebar'>
    //   <div className='menu'>
    //     <div className="logo">
    //       <h2>كافيار</h2>
    //       <span ref={menuicon} className="material-symbols-outlined menu-icon" onClick={opensidebar}>menu_open</span>
    //     </div>
    //     <div className='sid-list'>
    //       {menuitem.map((item, i) => {
    //         return (
    //           <Link to={item.sideitem != 'dashboard' ? item.sideitem : ''} className='item' key={i}>
    //             <span className="material-symbols-outlined icon-manag">{item.icon}</span>
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

export default SideBar