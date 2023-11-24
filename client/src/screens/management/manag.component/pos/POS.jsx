// import React, { useState, useRef } from 'react'
// import { detacontext } from '../../../../App'
// import { useReactToPrint } from 'react-to-print';
// import './POS.css'

// const POS = () => {
//   const ordersText = useRef()
//   const orderside = useRef()
//   const printContainer = useRef()
//   const handlePrint = useReactToPrint({
//     content: () => printContainer.current,
//     copyStyles: true,
//     removeAfterPrint: true,
//     bodyClass: 'printpage'
//   });
//   const [tableID, settableID] = useState('')

//   const [itemid, setitemid] = useState([])
//   const [noteArea, setnoteArea] = useState(false)
//   const [productid, setproductid] = useState('')

//   const [clientname, setclientname] = useState('')
//   const [clientphone, setclientphone] = useState('')
//   const [clientaddress, setclientaddress] = useState('')
//   const [ordertype, setordertype] = useState('')
//   return (
//     <detacontext.Consumer>
//       {
//         ({ allProducts, allcategories, allTable, employeeLoginInfo, setcategoryid, categoryid, additemtocart, deleteitems, increment, descrement, setproductnote, addnotrstoproduct, usertitle, ItemsInCart, costOrder, createWaiterOrder, createCasherOrder, POSinvoice, totalinvoice, list_products_order, orderupdate_date, myorder, checkout }) => {
//           if (employeeLoginInfo) {
//             return (
//               <section className='pos-section'>
//                 <div className='pos-cart'>
//                   <div className="cart-wrapper">
//                     <div className="cart-container h-100">
//                       <div className="slide-controler">
//                         <input type="radio" name="slide" id="order-radio" defaultChecked />
//                         <input type="radio" name="slide" id="invoice-radio" />
//                         <label htmlFor="order-radio" className="slide order" onClick={() => {
//                           orderside.current.style.marginRight = "0%";
//                         }}>طلباتك الحالية</label>
//                         {tableID ?
//                           <label htmlFor="invoice-radio" className="slide invoice" onClick={() => {
//                             POSinvoice(tableID);
//                             orderside.current.style.marginRight = "-50%";
//                           }}>الفاتورة</label> :
//                           <label htmlFor="invoice-radio" className="slide invoice" onClick={() => {
//                             POSinvoice(employeeLoginInfo.employeeinfo.id);
//                             orderside.current.style.marginRight = "-50%";
//                             ordersText.current.style.marginRight = "-50%";
//                           }}>الفاتورة</label>}
//                         <div className="slider-tab">

//                         </div>
//                       </div>
//                       <div className="cart-inner">
//                         <div ref={orderside} className="order side">
//                           <div className='side-content'>
//                             {ItemsInCart.map((i, index) => {
//                               return (
//                                 <div className="pos-cart-item" key={index}>
//                                   {i._id == productid & noteArea == true ? <form className='pos-note-text' onSubmit={(e) => { addnotrstoproduct(e, i._id);; setnoteArea(!noteArea) }}>
//                                     <textarea placeholder='اضف تعليماتك الخاصة بهذا الطبق' name="note" cols="100" rows="3" onChange={(e) => { setproductnote(e.target.value) }}></textarea>
//                                     <div className='note-btn'>
//                                       <button>تاكيد</button>
//                                       <button onClick={() => setnoteArea(!noteArea)}>الغاء</button>
//                                     </div>
//                                   </form> : ''}
//                                   <div className='cart-item-name'>
//                                     <div className='pod-item-name'>{i.name}</div>
//                                     <span className="material-symbols-outlined pos-note" onClick={() => { setnoteArea(!noteArea); setproductid(i._id) }}>note_alt</span>
//                                     <button onClick={() => deleteitems(i._id)}>حذف</button>
//                                   </div>
//                                   <div className="item-cost">
//                                     <div className='item-price'>{i.price} ج</div>
//                                     <div className="pos-card-counter">
//                                       <button className='counter-symb' onClick={() => descrement(i._id)}>-</button>
//                                       <span className='counter-num'>{i.quantity}</span>
//                                       <button className='counter-symb' onClick={() => increment(i._id)}>+</button>
//                                     </div>
//                                     <div className='item-subprice'>{i.price * i.quantity} ج</div>
//                                   </div>
//                                   {i.notes ? <div className='pos-cart-note'>{i.notes}</div> : ''}
//                                 </div>
//                               )
//                             })
//                             }
//                           </div>
//                           <div className="total-order">
//                             {employeeLoginInfo.employeeinfo.role === 'waiter' ?
//                               <button className='total-order-btn' onClick={() => createWaiterOrder(tableID, employeeLoginInfo.employeeinfo.id)}>تاكيد الطلب</button>
//                               : <button className='total-order-btn' onClick={() => createCasherOrder(employeeLoginInfo.employeeinfo.id, clientname, clientphone, clientaddress, ordertype)}>تاكيد الطلب</button>
//                             }

//                             <div className='total-order-details'>
//                               <h2>المجموع</h2>
//                               <p>{costOrder}</p>
//                             </div>
//                           </div>
//                         </div>


//                         <div className="invoice side" >
//                           <div ref={printContainer} className="side-content">
//                           <div id="invoice-POS">
//                           <center id="top">
//                             <div className="logo"></div>
//                             <div className="info">
//                               <h2>SBISTechs Inc</h2>
//                             </div>
//                           </center>

//                           <div id="mid">
//                             <div className="info">
//                               <h2>Contact Info</h2>
//                               <p>
//                                 Address : street city, state 0000
//                                 Email   : JohnDoe@gmail.com
//                                 Phone   : 555-555-5555
//                               </p>
//                             </div>
//                           </div>

//                           <div id="bot">

//                             <div id="table">
//                               <table>
//                                 <tr className="tabletitle">
//                                   <td className="item"><h2>المنتج</h2></td>
//                                   <td className="Hours"><h2>الكمية</h2></td>
//                                   <td className="Hours"><h2>السعر</h2></td>
//                                   <td className="Rate"><h2>التكلفه</h2></td>
//                                 </tr>
//                                 {list_products_order.map((item, i) => {
//                                   console.log(`list_products_order ${list_products_order}`)
//                                   return (
//                                     <tr className="service">
//                                       <td className="tableitem"><p className="itemtext">{item.name}</p></td>
//                                       <td className="tableitem"><p className="itemtext">{item.quantity}</p></td>
//                                       <td className="tableitem"><p className="itemtext">{item.price}</p></td>
//                                       <td className="tableitem"><p className="itemtext">{item.totalprice}</p></td>
//                                     </tr>)
//                                 }
//                                 )}


//                                 <tr className="tabletitle">
//                                   <td className="Rate" colspan="3"><h2>المجموع</h2></td>
//                                   <td className="payment"><h2>{totalinvoice}</h2></td>
//                                 </tr>
//                                 <tr className="tabletitle">
//                                   <td className="Rate" colspan="3"><h2>ضرائب</h2></td>
//                                   <td className="payment"><h2>{totalinvoice * 0.14}</h2></td>
//                                 </tr>

//                                 <tr className="tabletitle">
//                                   <td className="Rate" colspan="3"><h2>الاجمالي</h2></td>
//                                   <td className="payment"><h2>{totalinvoice + totalinvoice * 0.14}</h2></td>
//                                 </tr>

//                               </table>
//                             </div>

//                             <div id="legalcopy">
//                               <p className="legal"><strong>Thank you for your business!</strong>  Payment is expected within 31 days; please process this invoice within that time. There will be a 5% interest charge per month on late invoices.
//                               </p>
//                             </div>

//                           </div>
//                         </div>
//                             {/* <table className="invoice-info-container">
//                               <tbody>
//                                 <tr>
//                                   <td rowSpan="2" className="client-name">
//                                     عميل:{employeeLoginInfo ? usertitle(employeeLoginInfo.id) : ''}
//                                   </td>
//                                   <td rowSpan="2">
//                                     كافيار
//                                   </td>
//                                 </tr>
//                                 <tr>
//                                   <td>
//                                     Invoice Date: <strong>{orderupdate_date}</strong>
//                                   </td>
//                                   <td>
//                                     Invoice No: <strong>{myorder.serial}</strong>
//                                   </td>
//                                 </tr>
//                               </tbody>
//                             </table>
//                             <table className="line-items-container">
//                               <thead>
//                                 <tr>
//                                   <th className="bold heading-name">المنتج</th>
//                                   <th className="bold heading-quantity">الكمية</th>
//                                   <th className="bold heading-price">السعر</th>
//                                   <th className="bold heading-subtotal">التكلفه</th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {list_produccts_order.map((item, i) => {
//                                   return (
//                                     <tr key={i}>
//                                       <td className="bold heading-name">{item.name}</td>
//                                       <td className="bold heading-quantity">{item.quantity}</td>
//                                       <td className="bold heading-price">{item.price}</td>
//                                       <td className="bold heading-subtotal">{item.totalprice}</td>
//                                     </tr>
//                                   )
//                                 })}


//                               </tbody>
//                             </table>

//                             <table className="line-items-container has-bottom-border">
//                               <thead>
//                                 <tr>
//                                   <th>Due By</th>
//                                   <th>Total Due</th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 <tr>
//                                   <td className="large">{orderupdate_date}</td>
//                                   <td className="large total">{totalinvoice}</td>
//                                 </tr>
//                               </tbody>

//                             </table>
//                             <div className="footer">
//                               <div className="footer-info">
//                                 <span>hello@useanvil.com</span> |
//                                 <span>555 444 6666</span> |
//                                 <span>useanvil.com</span>
//                               </div>
//                               <div className="footer-thanks">
//                                 <img src="https://github.com/anvilco/html-pdf-invoice-template/raw/main/img/heart.png" alt="heart" />
//                                 <span>Thank you!</span>
//                               </div>
//                             </div> */}
//                           </div>
//                           <div className="total-order">
//                             <button className='total-order-btn' onClick={() => checkout()}>طلب الحساب</button>
//                             <button className='total-order-btn' onClick={handlePrint}>طباعه</button>
//                             <div className='total-order-details'>
//                               <h2>الاجمالي</h2>
//                               <p>{totalinvoice}</p>
//                             </div>

//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className='pos-content'>
//                   <div className='client-formgroup'>
//                     {employeeLoginInfo.employeeinfo.role == 'waiter' ?
//                       <form className="form-info">
//                         <div className='formgroup'>
//                           <label htmlFor='table'>رقم الطاولة:</label>
//                           <select id='table' required onChange={(e) => { settableID(e.target.value) }}>
//                             <option >اختر رقم الطاولة</option>
//                             {allTable.map((table, i) => {
//                               return <option value={table._id} key={i}>{table.tablenum}</option>
//                             }
//                             )}
//                           </select>
//                         </div>
//                       </form>
//                       :
//                       <form className="form-info">
//                         <div className='formgroup'>
//                           <label htmlFor="name">نوع الاوردر</label>
//                           <select id='table' required onChange={(e) => { setordertype(e.target.value) }}>
//                             <option >اختر نوع الاوردر</option>
//                             <option value='Delivery'>Delivery</option>
//                             <option value='Takeaway'>Takeaway</option>
//                           </select>
//                         </div>
//                         {ordertype ? ordertype == 'Delivery' ?
//                           <><div className='formgroup'>
//                             <label htmlFor="name">اسم العميل</label>
//                             <input type='text' className="info-input" required onChange={(e) => setclientname(e.target.value)} />
//                           </div>
//                             <div className='formgroup'>
//                               <label htmlFor="name">رقم الوبايل</label>
//                               <input type='text' className="info-input" required onChange={(e) => setclientphone(e.target.value)} />
//                             </div>
//                             <div className='info-adress'>
//                               <label htmlFor="name">العنوان</label>
//                               <textarea className="info-input" required onChange={(e) => setclientaddress(e.target.value)} />
//                             </div></> : <><div className='formgroup'>
//                               <label htmlFor="name">اسم العميل</label>
//                               <input type='text' className="info-input" required onChange={(e) => setclientname(e.target.value)} />
//                             </div>
//                             <div className='formgroup'>
//                               <label htmlFor="name">رقم الوبايل</label>
//                               <input type='text' className="info-input" required onChange={(e) => setclientphone(e.target.value)} />
//                             </div></>
//                           : ''}
//                       </form>}
//                   </div>
//                   <div className='categ-menu'>
//                     <div className='pos-menu'>
//                       {allProducts.filter(pro => pro.category === categoryid).map((product, index) => {
//                         return (
//                           <div className="pos-card" key={index} onClick={() => additemtocart(product._id)}>
//                             <img className='pos-img-card' src={`https://raw.githubusercontent.com/beshoynady/restaurant-api/main/server/images/${product.image}`} alt="" />
//                             <div className="pos-card-detalis">
//                               <div className='card-name'>
//                                 <div className='product-name'>{product.name}</div>
//                                 <div className='product-price'>{product.price}ج</div>

//                               </div>
//                               <div className='card-discription'>{product.description}</div>

//                               <div className='pos-btn'>
//                               </div>
//                             </div>
//                           </div>
//                         )
//                       }
//                       )}
//                     </div>
//                     <nav className='pos-category'>
//                       <ul className='category-ul'>
//                         {allcategories.map((c, i) => <li key={i} className='category-li' onClick={() => setcategoryid(c._id)}>
//                           <a className='category-pos-btn'>{c.name}</a>
//                         </li>
//                         )}
//                       </ul>
//                     </nav>
//                   </div>
//                 </div>
//               </section>
//             )
//           } else { return <></> }
//         }
//       }
//     </detacontext.Consumer>

//   )
// }

// export default POS

import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';

const POSPage = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
    // ... more categories
  ]);

  const [products, setProducts] = useState([
    { id: 1, name: 'Product 1', price: 10, categoryId: 1, image: 'product1.jpg' },
    { id: 2, name: 'Product 2', price: 15, categoryId: 1, image: 'product2.jpg' },
    // ... more products
  ]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    const filteredProducts = products.filter(product => product.categoryId === categoryId);
    setSelectedProducts(filteredProducts);
  };

  const handleProductClick = (productId) => {
    // Logic to add product to order/finalize sale
    // You can implement this based on your requirements
  };

  return (
    <Container>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Header>Categories</Card.Header>
            <ListGroup variant="flush">
              {categories.map(category => (
                <ListGroup.Item
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  active={selectedCategory === category.id}
                >
                  {category.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Header>Products</Card.Header>
            <Card.Body>
              <Row>
                {selectedProducts.map(product => (
                  <Col key={product.id} md={4}>
                    <Card onClick={() => handleProductClick(product.id)}>
                      <Card.Img variant="top" src={product.image} alt={product.name} />
                      <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>Price: ${product.price}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Order summary or invoice section can be added here */}
    </Container>
  );
};

export default POS;
