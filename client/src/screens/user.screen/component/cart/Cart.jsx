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
        ({ userLoginInfo, usertitle, ItemsInCart, costOrder, deleteitems, createClientOrder, invoice, totalinvoice, list_products_order,ordertotal, ordersubtotal, ordertax, orderdeliveryCost
          , orderupdate_date, myorder, checkout }) => {
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
                    {id ? <label htmlFor="invoice-radio" className="slide invoice" onClick={() => {
                      invoice(id);
                      orderside.current.style.marginRight = "-50%";
                      ordersText.current.style.marginRight = "-50%";
                    }}>الفاتورة</label>
                      : userLoginInfo ? <label htmlFor="invoice-radio" className="slide invoice" onClick={() => {
                        invoice(userLoginInfo.userinfo.id);
                        orderside.current.style.marginRight = "-50%";
                        ordersText.current.style.marginRight = "-50%";
                      }}>الفاتورة</label>
                        : ""}
                    <div className="slider-tab">

                    </div>
                  </div>
                  <div className="cart-inner">
                    <div ref={orderside} className="order side">
                      <div className='side-content'>
                        {ItemsInCart.map((i, index) => {
                          return (
                            i.quantity > 0 ?
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
                              : ''
                          )
                        })
                        }
                      </div>
                      <div className="total-order">

                        {id ? <button className='total-order-btn' onClick={() => createClientOrder(id)}>تاكيد الطلب</button> : userLoginInfo&&userLoginInfo.userinfo ? <button className='total-order-btn' onClick={() => createClientOrder(userLoginInfo.userinfo.id)}>تاكيد الطلب</button>
                          : ''}

                        <div className='total-order-details'>
                          <h2>المجموع</h2>
                          <p>{costOrder}</p>
                        </div>
                      </div>
                    </div>
                    <div className="invoice side" >
                      <div ref={printContainer} className="side-content">
                        <div id="invoice-POS">
                          <center id="top">
                            <div className="logo"></div>
                            <div className="info">
                              <h2>SBISTechs Inc</h2>
                            </div>
                          </center>

                          <div id="mid">
                            <div className="info">
                              <h2>Contact Info</h2>
                              <p>
                                Address : street city, state 0000
                                Email   : JohnDoe@gmail.com
                                Phone   : 555-555-5555
                              </p>
                            </div>
                          </div>

                          <div id="bot">

                            <div id="table">
                              <table>
                                <tr className="tabletitle">
                                  <td className="item"><h2>المنتج</h2></td>
                                  <td className="Hours"><h2>الكمية</h2></td>
                                  <td className="Hours"><h2>السعر</h2></td>
                                  <td className="Rate"><h2>التكلفه</h2></td>
                                </tr>
                                {list_products_order.map((item, i) => {
                                  console.log(`list_products_order ${list_products_order}`)
                                  return (
                                    <tr className="service">
                                      <td className="tableitem"><p className="itemtext">{item.name}</p></td>
                                      <td className="tableitem"><p className="itemtext">{item.quantity}</p></td>
                                      <td className="tableitem"><p className="itemtext">{item.price}</p></td>
                                      <td className="tableitem"><p className="itemtext">{item.totalprice}</p></td>
                                    </tr>)
                                }
                                )}


                                <tr className="tabletitle">
                                  <td className="Rate" colspan="3"><h2>المجموع</h2></td>
                                  <td className="payment"><h2>{ordersubtotal}</h2></td>
                                </tr>
                                {orderdeliveryCost?<tr className="tabletitle">
                                  <td className="Rate" colspan="3"><h2>الديلفري</h2></td>
                                  <td className="payment"><h2>{orderdeliveryCost}</h2></td>
                                </tr>
                                :''}
                                <tr className="tabletitle">
                                  <td className="Rate" colspan="3"><h2>ضرائب</h2></td>
                                  <td className="payment"><h2>{ordertax}</h2></td>
                                </tr>

                                <tr className="tabletitle">
                                  <td className="Rate" colspan="3"><h2>الاجمالي</h2></td>
                                  <td className="payment"><h2>{ordertotal}</h2></td>
                                </tr>

                              </table>
                            </div>

                            <div id="legalcopy">
                              <p className="legal"><strong>Thank you for your business!</strong>  Payment is expected within 31 days; please process this invoice within that time. There will be a 5% interest charge per month on late invoices.
                              </p>
                            </div>

                          </div>
                        </div>
                      </div>
                      <div className="total-order">
                        {id ? <button className='total-order-btn' onClick={() => checkout()}>طلب الحساب</button> : ""}

                        <button className='total-order-btn' onClick={handlePrint}>طباعه</button>
                        <div className='total-order-details'>
                          <h2>الاجمالي</h2>
                          <p>{totalinvoice + (totalinvoice*.14)}</p>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div >
            </div >
          )
        }
      }
    </detacontext.Consumer >
  )
}

export default Cart
