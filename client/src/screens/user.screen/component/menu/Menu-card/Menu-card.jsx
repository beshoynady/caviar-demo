import React, { useState } from 'react';
import { Card, Button, Form, FormControl, InputGroup } from 'react-bootstrap';
import { detacontext } from '../../../../../App';

const MenuCard = () => {
  const [noteArea, setNoteArea] = useState(false);
  const [productid, setProductid] = useState('');

  return (
    <detacontext.Consumer>
      {({ allProducts, categoryid, additemtocart, deleteitems, increment, descrement, setproductnote, addnotrstoproduct, itemid }) => {
                           return (
                              <div className="d-flex flex-wrap">
                                {allProducts.filter(pro => pro.category === categoryid).map((product, index) => (
                                  <Card className="m-3" key={index} style={{ width: '18rem' }}>
                                    <Card.Img variant="top" src={`https://raw.githubusercontent.com/beshoynady/restaurant-api/main/server/images/${product.image}`} />
                                    <Card.Body>
                                      {product._id === productid && noteArea ? (
                                        <Form onSubmit={(e) => { addnotrstoproduct(e, product._id); setNoteArea(!noteArea) }}>
                                          <Form.Control as="textarea" placeholder="اضف تعليماتك الخاصة بهذا الطبق" onChange={(e) => setproductnote(e.target.value)} />
                                          <div className="mt-2 d-flex justify-content-end">
                                            <Button type="submit" className="mr-2">تأكيد</Button>
                                            <Button variant="secondary" onClick={() => setNoteArea(!noteArea)}>الغاء</Button>
                                          </div>
                                        </Form>
                                      ) : (
                                        <div>
                                          <Card.Title>{product.name}</Card.Title>
                                          <Card.Text>{product.description}</Card.Text>
                                          <InputGroup className="mb-3">
                                            <InputGroup.Prepend>
                                              <Button variant="outline-secondary" onClick={() => descrement(product._id)}>-</Button>
                                            </InputGroup.Prepend>
                                            <FormControl readOnly value={product.quantity} />
                                            <InputGroup.Append>
                                              <Button variant="outline-secondary" onClick={() => increment(product._id)}>+</Button>
                                            </InputGroup.Append>
                                          </InputGroup>
                                          <Card.Text>
                                            {product.discount > 0 ? (
                                              <span>{product.price - product.discount} <del>{product.price}</del></span>
                                            ) : (
                                              <span>{product.price} ج</span>
                                            )}
                                          </Card.Text>
                                          <div>
                                            {itemid.includes(product._id) && product.quantity > 0 ? (
                                              <Button variant="danger" onClick={() => deleteitems(product._id)}>احذف من الطلبات</Button>
                                            ) : (
                                              <Button onClick={() => { if (product.quantity > 0) { additemtocart(product._id) } }}>اضف الى طلباتي</Button>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </Card.Body>
                                  </Card>
                                ))}
                              </div>

                           )}

      }
    </detacontext.Consumer>
  );
}

export default MenuCard;
