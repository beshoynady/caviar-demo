import React from 'react'
import './Menu.css'
import MenuCard from './Menu-card/Menu-card';
import {detacontext} from '../../../../App'


const Menu = () => {
  return (
    <detacontext.Consumer>
      {
        ({allcategories, filterByCategoryId,categoryid})=>{
          return(
            <section id='menu' className='menu'>
              <div className="container">
                <div className='section-title'>
                  <h2>menu</h2>
                </div>
                <div className='section-content'>
                  <nav className="menu-nav">
                    <ul>
                      {allcategories.map((c,i)=><li key={i}><button type="button" value={c._id} onClick={filterByCategoryId}>{c.name}</button></li> )}
                    </ul>
                  </nav>
                  <MenuCard/>
                </div>
              </div>
            </section>
          )
        }
      }
    </detacontext.Consumer>
  )
}

export default Menu