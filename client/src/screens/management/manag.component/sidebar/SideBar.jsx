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
    { title: 'التصنيفات', sideitem: 'category', icon: "category" },
    { title: 'المنتجات', sideitem: 'products', icon: "restaurant" },
    { title: 'الطاولة', sideitem: 'tables', icon: "table_restaurant" },
    { title: 'الموظفين', sideitem: 'employees', icon: "group_add" },
    { title: 'اصناف المخزن', sideitem: 'stockitem', icon: "inventory_2" },
    { title: 'ادارة المخزون', sideitem: 'stockmang', icon: "inventory" },
  ]


  const opensidebar = () => {
    sidebar.current.classList.toggle("toggle-width")
    menuicon.current.classList.toggle("rotate")
  }

  const sidebar = useRef()
  const menuicon = useRef()

  useEffect(() => {
  }, [])

  return (
    <div ref={sidebar} className='sidebar'>
      <div className='menu'>
        <div className="logo">
          <h2>كافيار</h2>
          <span ref={menuicon} className="material-symbols-outlined menu-icon" onClick={opensidebar}>menu_open</span>
        </div>
        <div className='sid-list'>
          {menuitem.map((item, i) => {
            return (
              <Link to={item.sideitem != 'dashboard' ? item.sideitem : ''} className='item' key={i}>
                <span className="material-symbols-outlined icon-manag">{item.icon}</span>
                <p className='menu-title'>{item.title}</p>
              </Link>
            )
          })
          }
        </div>
      </div>
    </div>
  )
}

export default SideBar