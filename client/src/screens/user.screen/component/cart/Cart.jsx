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
                    <div class="invoice">
    <div class="top_line"></div>
    <div class="header">
      <div class="i_row">
        <div class="i_logo">
          <p>Coding Market</p>
        </div>
        <div class="i_title">
          <h2>INVOICE</h2>
          <p class="p_title text_right">
            April 20, 2023
          </p>
        </div>
      </div>
      <div class="i_row">
        <div class="i_number">
          <p class="p_title">INVOICE NO: 3452324</p>
        </div>
        <div class="i_address text_right">
          <p>TO</p>
          <p class="p_title">
            Facebook <br />
            <span>Menlo Park, California</span><br />
            <span>United States</span>
          </p>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="i_table">
        <div class="i_table_head">
          <div class="i_row">
            <div class="i_col w_15">
              <p class="p_title">QTY</p>
            </div>
            <div class="i_col w_55">
              <p class="p_title">DESCRIPTION</p>
            </div>
            <div class="i_col w_15">
              <p class="p_title">PRICE</p>
            </div>
            <div class="i_col w_15">
              <p class="p_title">TOTAL</p>
            </div>
          </div>
        </div>
        <div class="i_table_body">
          <div class="i_row">
            <div class="i_col w_15">
              <p>3</p>
            </div>
            <div class="i_col w_55">
              <p>Lorem, ipsum.</p>
              <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, vel.</span>
            </div>
            <div class="i_col w_15">
              <p>$10.00</p>
            </div>
            <div class="i_col w_15">
              <p>$30.00</p>
            </div>
          </div>
          <div class="i_row">
            <div class="i_col w_15">
              <p>2</p>
            </div>
            <div class="i_col w_55">
              <p>Lorem, ipsum.</p>
              <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, vel.</span>
            </div>
            <div class="i_col w_15">
              <p>$10.00</p>
            </div>
            <div class="i_col w_15">
              <p>$20.00</p>
            </div>
          </div>
          <div class="i_row">
            <div class="i_col w_15">
              <p>5</p>
            </div>
            <div class="i_col w_55">
              <p>Lorem, ipsum.</p>
              <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, vel.</span>
            </div>
            <div class="i_col w_15">
              <p>$10.00</p>
            </div>
            <div class="i_col w_15">
              <p>$100.00</p>
            </div>
          </div>
        </div>
        <div class="i_table_foot">
          <div class="i_row">
            <div class="i_col w_15">
              <p></p>
            </div>
            <div class="i_col w_55">
              <p></p>
            </div>
            <div class="i_col w_15">
              <p>Sub Total</p>
              <p>Tax 10%</p>
            </div>
            <div class="i_col w_15">
              <p>$150.00</p>
              <p>$15.00</p>
            </div>
          </div>
          <div class="i_row grand_total_wrap">
            <div class="i_col w_50">
            </div>
            <div class="i_col w_50 grand_total">
              <p><span>GRAND TOTAL:</span>
                <span>$165.00</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="i_row">
        <div class="i_col w_50">
          <p class="p_title">Payment Method</p>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque, dicta distinctio! Laudantium voluptatibus est nemo.</p>
        </div>
        <div class="i_col w_50 text_right">
          <p class="p_title">Terms and Conditions</p>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque, dicta distinctio! Laudantium voluptatibus est nemo.</p>
        </div>
      </div>
    </div>
    <div class="bottom_line"></div>
  </div>

                      {/* <div ref={printContainer} className="side-content">
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
                              {/* <th>Due By</th>
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
                      </div> */}
                      {/* <div className="total-order">
                        {id?<button className='total-order-btn' onClick={() => checkout()}>طلب الحساب</button>:""}
                        
                        <button className='total-order-btn' onClick={handlePrint}>طباعه</button>
                        <div className='total-order-details'>
                          <h2>الاجمالي</h2>
                          <p>{totalinvoice}</p>
                        </div>

                      </div>  */}
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
