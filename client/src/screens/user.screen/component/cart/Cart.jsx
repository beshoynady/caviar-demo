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
        ({ userLoginInfo, usertitle, ItemsInCart, costOrder, deleteitems, invoice, totalinvoice, list_products_order, ordertotal, ordersubtotal, ordertax, orderdeliveryCost
          , createClientOrderForUser, createClientOrderForTable, checkout }) => {
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
                                      <p>{i.discount ? i.priceAfterDiscount : i.price} ج</p>
                                      <p>×{i.quantity}</p>
                                    </div>
                                    <p>{i.discount ? i.priceAfterDiscount * i.quantity : i.price * i.quantity}</p>
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

                        {ItemsInCart.length > 0 ? (
                          <>
                            {id ? (
                              <button className='total-order-btn' onClick={() => createClientOrderForTable(id)}>تاكيد الطلب الطاولة</button>
                            ) : (
                              userLoginInfo && userLoginInfo.userinfo ? (
                                <button className='total-order-btn' onClick={() => createClientOrderForUser(userLoginInfo.userinfo.id)}>تاكيد الطلب</button>
                              ) : (
                                ''
                              )
                            )}
                            <div className='total-order-details'>
                              <h2>المجموع</h2>
                              <p>{costOrder}</p>
                            </div>
                          </>
                        ) : (
                          ''
                        )}

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
                              <table className="table table-striped">
                                <thead>
                                  <tr>
                                    <th scope="col">المنتج</th>
                                    <th scope="col">الكمية</th>
                                    <th scope="col">السعر</th>
                                    <th scope="col">التكلفة</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {list_products_order.map((item, i) => (
                                    <tr key={i}>
                                      <td>{item.name}</td>
                                      <td>{item.quantity}</td>
                                      <td>{item.priceAfterDiscount ? item.priceAfterDiscount : item.price}</td>
                                      <td>{item.totalprice}</td>
                                    </tr>
                                  ))}
                                  <tr className="tabletitle">
                                    <td className="Rate" colSpan="3">المجموع</td>
                                    <td className="payment">{ordersubtotal}</td>
                                  </tr>
                                  {orderdeliveryCost && (
                                    <tr className="tabletitle">
                                      <td className="Rate" colSpan="3">الديلفري</td>
                                      <td className="payment">{orderdeliveryCost}</td>
                                    </tr>
                                  )}
                                  <tr className="tabletitle">
                                    <td className="Rate" colSpan="3">ضرائب</td>
                                    <td className="payment">{ordertax}</td>
                                  </tr>
                                  <tr className="tabletitle">
                                    <td className="Rate" colSpan="3">الإجمالي</td>
                                    <td className="payment">{ordertotal}</td>
                                  </tr>
                                </tbody>
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
                          <p>{totalinvoice + (totalinvoice * .14)}</p>
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
