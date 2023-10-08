import React from 'react';
import './Menu-card.css';
import { detacontext } from '../../../../../App';

const MenuCard = () => {
   return (
      <detacontext.Consumer>
         {
            ({allProducts,categoryid,additemtocart, increment, descrement})=>{
               return(
                  <div className="card-group">
                     {allProducts.filter(pro=>pro.category==categoryid).map((product, index) =>{
                        return(
                           <div className="menu-card" key={index}>
                              <img className='img-card' src={`https://restaurant-api-blush.vercel.app/${product.image}`} alt="" />
                              <div className="detalis">
                                 <div className='product-det'>
                                    <h2>{product.name}</h2>
                                    <p>{product.description}</p>
                                 </div>
                                 <div className="price">
                                    <p>السعر{product.price}</p>

                                    <div className="counter">
                                       <button className='symb' onClick={()=>descrement(product._id)}>-</button>
                                       <span className='num'>{product.quantity}</span>
                                       <button className='symb' onClick={()=>increment(product._id)}>+</button>
                                    </div>
                                 </div>
                                 <div className='add_cart'>
                                    <button onClick={()=>{if(product.quantity>0){additemtocart(product._id, product.quantity)}}}>اضف الي طلباتي</button>
                                 </div>
                              </div>
                           </div>
                        )
                        }
                     )}
                  </div>
               )
            }
         }
      </detacontext.Consumer>
      
   )
}

export default MenuCard