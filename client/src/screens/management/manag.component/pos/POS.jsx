import React, { useState, useRef } from 'react'
import { detacontext } from '../../../../App'
import { useReactToPrint } from 'react-to-print';
import './POS.css'

const POS = () => {
  const ordersText = useRef()
  const orderside = useRef()
  const printContainer = useRef()
  const handlePrint = useReactToPrint({
    content: () => printContainer.current,
    copyStyles: true,
    removeAfterPrint: true,
    bodyClass: 'printpage'
  });
  const [tableID, settableID] = useState('')

  const [itemid, setitemid] = useState([])
  const [noteArea, setnoteArea] = useState(false)
  const [productid, setproductid] = useState('')

  const [clientname, setclientname] = useState('')
  const [clientphone, setclientphone] = useState('')
  const [clientaddress, setclientaddress] = useState('')
  const [ordertype, setordertype] = useState('')
  return (
    <detacontext.Consumer>
      {
        ({ allProducts, allcategories, alltable, userlogininfo, setcategoryid, categoryid, additemtocart, deleteitems, increment, descrement, setproductnote, addnotrstoproduct, usertitle, itemsincart, costOrder, CreateWaiterOrder, CreateCasherOrder, POSinvoice, totalinvoice, list_produccts_order, orderupdate_date, myorder, checkout }) => {
          if (userlogininfo) {
            return (
              <section className='pos-section'>
                <div className='pos-cart'>
                  <div className="cart-wrapper">
                    <div className="cart-container h-100">
                      <div className="slide-controler">
                        <input type="radio" name="slide" id="order-radio" defaultChecked />
                        <input type="radio" name="slide" id="invoice-radio" />
                        <label htmlFor="order-radio" className="slide order" onClick={() => {
                          orderside.current.style.marginRight = "0%";
                        }}>طلباتك الحالية</label>
                        {tableID ?
                          <label htmlFor="invoice-radio" className="slide invoice" onClick={() => {
                            POSinvoice(tableID);
                            orderside.current.style.marginRight = "-50%";
                          }}>الفاتورة</label> :
                          <label htmlFor="invoice-radio" className="slide invoice" onClick={() => {
                            POSinvoice(userlogininfo.id);
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
                                <div className="pos-cart-item" key={index}>
                                  {i._id == productid & noteArea == true ? <form className='pos-note-text' onSubmit={(e) => { addnotrstoproduct(e, i._id);; setnoteArea(!noteArea) }}>
                                    <textarea placeholder='اضف تعليماتك الخاصة بهذا الطبق' name="note" cols="100" rows="3" onChange={(e) => { setproductnote(e.target.value) }}></textarea>
                                    <div className='note-btn'>
                                      <button>تاكيد</button>
                                      <button onClick={() => setnoteArea(!noteArea)}>الغاء</button>
                                    </div>
                                  </form> : ''}
                                  <div className='cart-item-name'>
                                    <div className='pod-item-name'>{i.name}</div>
                                    <span className="material-symbols-outlined pos-note" onClick={() => { setnoteArea(!noteArea); setproductid(i._id) }}>note_alt</span>
                                    <button onClick={() => deleteitems(i._id)}>حذف</button>
                                  </div>
                                  <div className="item-cost">
                                    <div className='item-price'>{i.price} ج</div>
                                    <div className="pos-card-counter">
                                      <button className='counter-symb' onClick={() => descrement(i._id)}>-</button>
                                      <span className='counter-num'>{i.quantity}</span>
                                      <button className='counter-symb' onClick={() => increment(i._id)}>+</button>
                                    </div>
                                    <div className='item-subprice'>{i.price * i.quantity} ج</div>
                                  </div>
                                  {i.notes ? <div className='pos-cart-note'>{i.notes}</div> : ''}
                                </div>
                              )
                            })
                            }
                          </div>
                          <div className="total-order">
                            {userlogininfo.role === 'waiter' ?
                              <button className='total-order-btn' onClick={() => CreateWaiterOrder(tableID, userlogininfo.id)}>تاكيد الطلب</button>
                              : <button className='total-order-btn' onClick={() => CreateCasherOrder(userlogininfo.id, clientname, clientphone, clientaddress, ordertype)}>تاكيد الطلب</button>
                            }

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
                            <button className='total-order-btn' onClick={() => checkout()}>طلب الحساب</button>
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
                <div className='pos-content'>
                  <div className='client-formgroup'>
                    {userlogininfo.role == 'waiter' ?
                      <form className="form-info">
                        <div className='formgroup'>
                          <label htmlFor='table'>رقم الطاولة:</label>
                          <select id='table' required onChange={(e) => { settableID(e.target.value) }}>
                            <option >اختر رقم الطاولة</option>
                            {alltable.map((table, i) => {
                              return <option value={table._id} key={i}>{table.tablenum}</option>
                            }
                            )}
                          </select>
                        </div>
                      </form>
                      :
                      <form className="form-info">
                        <div className='formgroup'>
                          <label htmlFor="name">نوع الاوردر</label>
                          <select id='table' required onChange={(e) => { setordertype(e.target.value) }}>
                            <option >اختر نوع الاوردر</option>
                            <option value='ديلفري'>ديلفري</option>
                            <option value='تيك اوي'>تيك اوي</option>
                          </select>
                        </div>
                        {ordertype ? ordertype == 'ديلفري' ?
                          <><div className='formgroup'>
                            <label htmlFor="name">اسم العميل</label>
                            <input type='text' className="info-input" required onChange={(e) => setclientname(e.target.value)} />
                          </div>
                            <div className='formgroup'>
                              <label htmlFor="name">رقم الوبايل</label>
                              <input type='text' className="info-input" required onChange={(e) => setclientphone(e.target.value)} />
                            </div>
                            <div className='info-adress'>
                              <label htmlFor="name">العنوان</label>
                              <textarea className="info-input" required onChange={(e) => setclientaddress(e.target.value)} />
                            </div></> : <><div className='formgroup'>
                              <label htmlFor="name">اسم العميل</label>
                              <input type='text' className="info-input" required onChange={(e) => setclientname(e.target.value)} />
                            </div>
                            <div className='formgroup'>
                              <label htmlFor="name">رقم الوبايل</label>
                              <input type='text' className="info-input" required onChange={(e) => setclientphone(e.target.value)} />
                            </div></>
                          : ''}
                      </form>}
                  </div>
                  <div className='categ-menu'>
                    <div className='pos-menu'>
                      {allProducts.filter(pro => pro.category === categoryid).map((product, index) => {
                        return (
                          <div className="pos-card" key={index} onClick={() => additemtocart(product._id)}>
                            <img className='pos-img-card' src={`https://raw.githubusercontent.com/beshoynady/restaurant-api/main/server/images/${product.image}`} alt="" />
                            <div className="pos-card-detalis">
                              <div className='card-name'>
                                <div className='product-name'>{product.name}</div>
                                <div className='product-price'>{product.price}ج</div>

                              </div>
                              <div className='card-discription'>{product.description}</div>

                              <div className='pos-btn'>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      )}
                    </div>
                    <nav className='pos-category'>
                      <ul className='category-ul'>
                        {allcategories.map((c, i) => <li key={i} className='category-li' onClick={() => setcategoryid(c._id)}>
                          <a className='category-pos-btn'>{c.name}</a>
                        </li>
                        )}
                      </ul>
                    </nav>
                  </div>
                </div>
              </section>
            )
          } else { return <></> }
        }
      }
    </detacontext.Consumer>

  )
}

export default POS