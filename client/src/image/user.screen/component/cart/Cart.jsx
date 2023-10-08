import React from 'react'
import { detacontext } from '../../../../App'
import {useParams } from 'react-router-dom';

import './Cart.css'

const Cart = (props) => {
  const open = props.opencart
  // const {id} = useParams()
  return (
    <detacontext.Consumer>
      {
        ({ itemsincart, costOrder, deleteitems }) => {
          return (
            <div className='cart' style={open ? { 'display': 'flex' } : { 'display': 'none' }}>
              {itemsincart.map((i, index) => {
                return (
                  <div className="cart-item" key={index}>
                    <div className="cart-img">
                      <img src={`https://restaurant-api-blush.vercel.app/${i.image}`} alt="" srcSet="" />
                    </div>
                      <div className="item-detalis">
                        <p>{i.name}</p>
                        <p>السعر:{i.price}</p>
                        <p>الكمية:{i.quantity}</p>
                      </div>
                    <div className="del-cost">
                      <button onClick={() => deleteitems(i._id)}>حذف</button>
                      <p>{i.price * i.quantity}</p>
                    </div>
                  </div>
                )
              })
              }
              <div className="final">
                <button>تاكيد الطلب</button>
                <div className='total'>
                  <p>الاجمال</p>
                  <p>{costOrder}</p>
                </div>
              </div>
            </div>
          )
        }
      }
    </detacontext.Consumer>
  )
}

export default Cart