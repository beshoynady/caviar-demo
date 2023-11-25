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
        ({ allProducts, allcategories, allTable, employeeLoginInfo, setcategoryid, categoryid, additemtocart, deleteitems, increment, descrement, setproductnote, addnotrstoproduct, usertitle, ItemsInCart, costOrder, createWaiterOrder, createCasherOrder, POSinvoice, list_products_order, ordertotal, ordersubtotal, ordertax, orderdeliveryCost }) => {
          if (employeeLoginInfo) {
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
                            POSinvoice(employeeLoginInfo.employeeinfo.id);
                            orderside.current.style.marginRight = "-50%";
                            ordersText.current.style.marginRight = "-50%";
                          }}>الفاتورة</label>}
                        <div className="slider-tab">

                        </div>
                      </div>
                      <div className="cart-inner">
                        <div ref={orderside} className="order side">
                          <div className='side-content'>
                            {ItemsInCart.map((i, index) => {
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
                            {employeeLoginInfo.employeeinfo.role === 'waiter' ?
                              <button className='total-order-btn' onClick={() => createWaiterOrder(tableID, employeeLoginInfo.employeeinfo.id)}>تاكيد الطلب</button>
                              : <button className='total-order-btn' onClick={() => createCasherOrder(employeeLoginInfo.employeeinfo.id, clientname, clientphone, clientaddress, ordertype)}>تاكيد الطلب</button>
                            }

                            <div className='total-order-details'>
                              <h2>المجموع</h2>
                              <p>{costOrder}</p>
                            </div>
                          </div>
                        </div>


                        <div className="invoice side" >
                          <div ref={printContainer} className="side-content">
                            <div className="container">
                              {/* Buttons */}
                              <div>
                                <button className="btn btn-primary mr-2" onClick={() => {/* Function for download invoice */ }}>Download Invoice</button>
                                <button className="btn btn-success" onClick={() => {/* Function for printing invoice */ }}>Print Invoice</button>
                              </div>
                              {/* Invoice Header */}
                              <div className="invoice-header" style={{ backgroundColor: '#343a40', color: '#ffffff', padding: '20px', textAlign: 'center' }}>
                                <h2>Restaurant Name</h2>
                                <p>Invoice #1234 | Date: November 25, 2023 | Time: 14:30</p>
                              </div>

                              {/* Customer Information */}
                              <div className="customer-info" style={{ marginBottom: '20px' }}>
                                <h4>Customer Details</h4>
                                <p>Name: John Doe</p>
                                <p>Mobile: 123-456-7890</p>
                                <p>Address: 123 Main St, City</p>
                              </div>

                              {/* Order Details Table */}
                              <table className="table table-bordered">
                                <thead className="thead-dark">
                                  <tr>
                                    <th scope="col">Item</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {/* Example rows, replace with dynamic data */}
                                  {list_products_order.map((item, i) => (
                                    <tr key={i}>
                                      <td>{item.name}</td>
                                      <td>{item.priceAfterDiscount ? item.priceAfterDiscount : item.price}</td>
                                      <td>{item.quantity}</td>
                                      <td>{item.totalprice}</td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot>
                                  <tr>
                                    <td colSpan="3">Subtotal</td>
                                    <td>{ordersubtotal}</td>
                                  </tr>
                                  {orderdeliveryCost && (
                                    <tr>
                                      <td colSpan="3">Delivery</td>
                                      <td>{orderdeliveryCost}</td>
                                    </tr>
                                  )}
                                  <tr>
                                    <td colSpan="3">Tax</td>
                                    <td>{Math.round(ordertax * 100) / 100}</td>
                                  </tr>
                                  <tr>
                                    <td colSpan="3">Total</td>
                                    <td>{ordertotal}</td>
                                  </tr>
                                </tfoot>
                              </table>

                              {/* Restaurant Information */}
                              <div className="restaurant-info" style={{ marginTop: '20px', textAlign: 'center' }}>
                                <h4>Restaurant Details</h4>
                                <p>Restaurant Name</p>
                                <p>Mobile: 987-654-3210</p>
                                <p>Address: 456 Street, City</p>
                              </div>

                              {/* Footer */}
                              <div className="footer" style={{ marginTop: '30px', textAlign: 'center', color: '#828282' }}>
                                <p>Developed by: <span style={{ color: '#5a6268' }}>esyservice</span></p>
                              </div>
                            </div>
                          </div>
                          {/* <div className="total-order">
                            <button className='total-order-btn' onClick={() => checkout()}>طلب الحساب</button>
                            <button className='total-order-btn' onClick={handlePrint}>طباعه</button>
                            <div className='total-order-details'>
                              <h2>الاجمالي</h2>
                              <p>{ordertotal}</p>
                            </div>

                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='pos-content'>
                  <div className='client-formgroup'>
                    {employeeLoginInfo.employeeinfo.role == 'waiter' ?
                      <form className="form-info">
                        <div className='formgroup'>
                          <label htmlFor='table'>رقم الطاولة:</label>
                          <select id='table' required onChange={(e) => { settableID(e.target.value) }}>
                            <option >اختر رقم الطاولة</option>
                            {allTable.map((table, i) => {
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
                            <option value='Delivery'>Delivery</option>
                            <option value='Takeaway'>Takeaway</option>
                          </select>
                        </div>
                        {ordertype ? ordertype == 'Delivery' ?
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