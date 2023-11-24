import React, { useState } from 'react';
// import './Menu-card.css';
import { detacontext } from '../../../../../App';
import { Card, Button } from 'react-bootstrap';

const MenuCard = () => {
  const [noteArea, setNoteArea] = useState(false);
  const [productid, setProductid] = useState('');

  return (
    <detacontext.Consumer>
      {({ allProducts, categoryid, additemtocart, deleteitems, increment, descrement, setproductnote, addnotrstoproduct, itemid }) => (
        <div className="card-group">
          {allProducts.filter(pro => pro.category === categoryid).map((product, index) => (
            <Card className="menu-card" key={index}>
              <Card.Img variant="top" src={`https://raw.githubusercontent.com/beshoynady/restaurant-api/main/server/images/${product.image}`} />
              {product._id === productid && noteArea === true ? (
                <Card.Body>
                  <form onSubmit={(e) => { addnotrstoproduct(e, product._id); setNoteArea(!noteArea) }}>
                    <textarea
                      placeholder='Add your special instructions for this dish'
                      name="note"
                      cols="100"
                      rows="3"
                      onChange={(e) => { setproductnote(e.target.value) }}
                    ></textarea>
                    <div className='note-btn'>
                      <Button type="submit">Confirm</Button>
                      <Button variant="secondary" onClick={() => setNoteArea(!noteArea)}>Cancel</Button>
                    </div>
                  </form>
                </Card.Body>
              ) : null}
              <Card.Body>
                <div className="details">
                  <div className='product-name'>
                    <Card.Title>{product.name}</Card.Title>
                    <span className="material-symbols-outlined" onClick={() => { setNoteArea(!noteArea); setProductid(product._id) }}>note_alt</span>
                  </div>
                  <Card.Text>{product.description}</Card.Text>
                </div>
                <div className="price">
                  <div className="counter">
                    <Button variant="outline-secondary" className='symb' onClick={() => descrement(product._id)}>-</Button>
                    <span className='num'>{product.quantity}</span>
                    <Button variant="outline-secondary" className='symb' onClick={() => increment(product._id)}>+</Button>
                  </div>
                  <Card.Text>
                    {product.discount > 0 ?
                      <>{product.price - product.discount}<sup><del>{product.price}</del></sup></> :
                      <>{product.price} ج</>}
                  </Card.Text>
                </div>
                <div className='card-btn'>
                  {itemid.filter((i) => i === product._id).length > 0 && product.quantity > 0 ? (
                    <Button variant="danger" className='delfromcart' onClick={() => { deleteitems(product._id) }}>Remove from Orders</Button>
                  ) : (
                    <Button variant="success" className='addtocart' onClick={() => { if (product.quantity > 0) { additemtocart(product._id) } }}>Add to My Orders</Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </detacontext.Consumer>
  )
}

export default MenuCard;
