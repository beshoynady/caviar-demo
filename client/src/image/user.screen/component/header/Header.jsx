import React, {useRef,useState} from 'react'

import './Header.css'
import Cart from '../cart/Cart'
import { Link } from 'react-router-dom'


const Header = () => {
  const [opencart, setopencart] = useState(false)
  const navref = useRef()

  const openmobmenu = ()=> {
    navref.current.classList.toggle(
			"show");
  }
  return (
    <header className='header-client'>
      <div className="container">
        <div className='logo'>
          <a href="#">CAVIAR</a>
        </div>
        <nav ref={navref}>
          <ul className='navigator'>
            <li onClick={()=>{openmobmenu()}}><a href="#">Home </a></li>
            <li onClick={()=>{openmobmenu()}}><a href="#menu">Menu</a></li>
            <li onClick={()=>{openmobmenu()}}><a href="#offer">offers</a></li>
            <li onClick={()=>{openmobmenu()}}><a href="#location">Location</a></li>
            <li onClick={()=>{openmobmenu()}}><a href="#contact">contact Us</a></li>
          </ul>
        </nav>
        <div className="mob-menu" onClick={()=>{openmobmenu()}}>
          <span id='line-1'></span>
          <span id='line-2'></span>
          <span id='line-3'></span>
        </div>
        <div className='right-nav'>
          <a href='login' className='login'>login</a>
          <a href="#" className='cart-icon' onClick={(e)=>{e.preventDefault(); setopencart(!opencart)}}>
          <span className="material-symbols-rounded">shopping_cart</span></a>
        </div>
        <Cart opencart={opencart}/>
      </div>
    </header>
  )
}

export default Header