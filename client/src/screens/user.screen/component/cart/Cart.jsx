import React, { useEffect, useState, useRef } from 'react'
import { detacontext } from '../../../../App'
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import './Cart.css'



const Cart = (props) => {
  const open_cart = props.opencart
  const ordersText = useRef()
  const orderside = useRef()
  const printContainer = useRef()
  const handlePrint = useReactToPrint({
    content: () => printContainer.current,
    copyStyles: true,
    removeAfterPrint: true,
    bodyClass: 'printpage'
  });

  const { id } = useParams()
  return (
    <detacontext.Consumer>
      {
        ({ userlogininfo, usertitle, itemsincart, costOrder, deleteitems, createclientorder, invoice, totalinvoice, list_produccts_order, orderupdate_date, myorder, checkout }) => {
          return (
            <div className='cart-section' style={open_cart ? { 'display': 'flex' } : { 'display': 'none' }}>
              <div className="cart-wrapper">
                <div className="title-text">
                  <div ref={ordersText} className="title order">
                    طلباتك الحالية
                  </div>
                  <div className="title invoice">
                    الفاتورة
                  </div>
                </div>
                <div className="cart-container">
                  <div className="slide-controler">
                    <input type="radio" name="slide" id="order-radio" defaultChecked />
                    <input type="radio" name="slide" id="invoice-radio" />
                    <label htmlFor="order-radio" className="slide order" onClick={() => {
                      orderside.current.style.marginRight = "0%";
                      ordersText.current.style.marginRight = "0%";
                    }}>طلباتك الحالية</label>
                    {userlogininfo ?
                      <label htmlFor="invoice-radio" className="slide invoice" onClick={() => {
                        invoice(userlogininfo.id);
                        orderside.current.style.marginRight = "-50%";
                        ordersText.current.style.marginRight = "-50%";
                      }}>الفاتورة</label> :
                      <label htmlFor="invoice-radio" className="slide invoice" onClick={() => {
                        invoice(id);
                        orderside.current.style.marginRight = "-50%";
                        ordersText.current.style.marginRight = "-50%";
                      }}>الفاتورة</label>}
                    <div className="slider-tab">

                    </div>
                  </div>
                  <div className="cart-inner">
                    <div ref={orderside} className="order side">
                      <div className='side-content'>
                        {itemsincart.map((i, index) => {
                          return (
                            i.quantity>0?
                            <div className="cart-item" key={index}>
                              <div className="cart-img">
                                <img src={`https://raw.githubusercontent.com/beshoynady/restaurant-api/main/server/images/${i.image}`} />
                              </div>
                              <div className='cart-det'>
                                <div className="item-head">
                                  <p>{i.name}</p>
                                  <button onClick={() => deleteitems(i._id)}>حذف</button>
                                </div>
                                <div className="del-cost">
                                  <div className='cart-price'>
                                    <p>{i.price} ج</p>
                                    <p>×{i.quantity}</p>
                                  </div>
                                  <p>{i.price * i.quantity}</p>
                                </div>
                                {i.notes ? <div className='cart-note'>{i.notes}</div> : ''}
                              </div>

                            </div>
                            :''
                          )
                        })
                        }
                      </div>
                      <div className="total-order">

                        {id ? <button className='total-order-btn' onClick={() => createclientorder(id)}>تاكيد الطلب</button> : userlogininfo ? <button className='total-order-btn' onClick={() => createclientorder(userlogininfo.id)}>تاكيد الطلب</button>
                          : ''}

                        <div className='total-order-details'>
                          <h2>المجموع</h2>
                          <p>{costOrder}</p>
                        </div>
                      </div>
                    </div>
                    <div className="invoice side" >
                      <div ref={printContainer} className="side-content">
                        <table className="invoice-info-container">
                          <tbody>
                            <tr>
                              <td rowSpan="2" className="client-name">
                                عميل:{userlogininfo ? usertitle(userlogininfo.id) : ''}
                              </td>
                              <td rowSpan="2">
                                كافيار
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Invoice Date: <strong>{orderupdate_date}</strong>
                              </td>
                              <td>
                                Invoice No: <strong>{myorder.serial}</strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table className="line-items-container">
                          <thead>
                            <tr>
                              <th className="bold heading-name">المنتج</th>
                              <th className="bold heading-quantity">الكمية</th>
                              <th className="bold heading-price">السعر</th>
                              <th className="bold heading-subtotal">التكلفه</th>
                            </tr>
                          </thead>
                          <tbody>
                            {list_produccts_order.map((item, i) => {
                              return (
                                <tr key={i}>
                                  <td className="bold heading-name">{item.name}</td>
                                  <td className="bold heading-quantity">{item.quantity}</td>
                                  <td className="bold heading-price">{item.price}</td>
                                  <td className="bold heading-subtotal">{item.totalprice}</td>
                                </tr>
                              )
                            })}


                          </tbody>
                        </table>

                        <table className="line-items-container has-bottom-border">
                          <thead>
                            <tr>
                              {/* <th>Payment Info</th> */}
                              <th>Due By</th>
                              <th>Total Due</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="large">{orderupdate_date}</td>
                              <td className="large total">{totalinvoice}</td>
                            </tr>
                          </tbody>

                        </table>
                        <div className="footer">
                          <div className="footer-info">
                            <span>hello@useanvil.com</span> |
                            <span>555 444 6666</span> |
                            <span>useanvil.com</span>
                          </div>
                          <div className="footer-thanks">
                            <img src="https://github.com/anvilco/html-pdf-invoice-template/raw/main/img/heart.png" alt="heart" />
                            <span>Thank you!</span>
                          </div>
                        </div>
                      </div>
                      <div className="total-order">
                        {id?<button className='total-order-btn' onClick={() => checkout()}>طلب الحساب</button>:""}
                        
                        <button className='total-order-btn' onClick={handlePrint}>طباعه</button>
                        <div className='total-order-details'>
                          <h2>الاجمالي</h2>
                          <p>{totalinvoice}</p>
                        </div>

                      </div>
                    </div>
                  </div>
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
