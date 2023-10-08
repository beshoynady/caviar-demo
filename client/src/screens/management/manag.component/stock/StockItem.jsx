import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App'
const StockItem = () => {



  const [itemName, setitemName] = useState("");
  const [unit, setunit] = useState('');
  const [Balance, setBalance] = useState();
  const [price, setprice] = useState();
  const [cost, setcost] = useState();
  const createAt =new Date().toLocaleString()

  const createitem = async (e, userid) => {
    console.log(createAt)
    e.preventDefault();
    try {
      const createBy = userid;
      const response = await axios.post('https://restaurant-api-blush.vercel.app/api/stockitem/', { itemName, unit, Balance, price,cost,createBy, createAt });
      console.log(response.data);
      getallStockItem()
    } catch (error) {
      console.log(error)
    }
  }

  const [StockItemid, setStockItemid] = useState("")

  const editStockItem = async (e,userid) => {
    e.preventDefault()
    const createBy = userid
      try {
        const response = await axios.put(`https://restaurant-api-blush.vercel.app/api/stockitem/${StockItemid}`, {itemName, unit, Balance, price,cost, createBy
        });
        console.log(response.data);
        if (response) {
          getallStockItem()
        }
      } catch (error) {
        console.log(error)
      }
    

  }


  const [AllStockItems, setAllStockItems] = useState([]);

  const getallStockItem = async () => {
    try {
      const response = await axios.get('https://restaurant-api-blush.vercel.app/api/stockitem/');
      const StockItems = await response.data;
      console.log(response.data)
      setAllStockItems(StockItems)

    } catch (error) {
      console.log(error)
    }

  }

  const deleteStockItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`https://restaurant-api-blush.vercel.app/api/stockitem/${StockItemid}`);
      if (response.status == 200) {
        console.log(response);
        getallStockItem();
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getallStockItem()
  }, [])
  return (
    <detacontext.Consumer>
      {
        ({ userlogininfo, usertitle, pagination, EditPagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <div className="table-responsive mt-1">
                <div className="table-wrapper p-3 mw-100">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>المنتجات</b></h2>
                      </div>
                      <div className="col-sm-6">
                        <a href="#addStockItemModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه منتج جديد</span></a>

                        <a href="#deleteStockItemModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
                      </div>
                    </div>
                  </div>
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>
                          <span className="custom-checkbox">
                            <input type="checkbox" id="selectAll" />
                            <label htmlFor="selectAll"></label>
                          </span>
                        </th>
                        <th>م</th>
                        <th>اسم الصنف</th>
                        <th>الوحدة</th>
                        <th>الرصيد الحالي</th>
                        <th>السعر</th>
                        <th>اجمالي التكلفة</th>
                        <th>تاريخ الاضافه</th>
                        <th>اضيف بواسطه</th>
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {AllStockItems && AllStockItems.map((item, i) => {
                        if (i < pagination & i >= pagination - 5) {
                          return (
                            <tr key={i}>
                              <td>
                                <span className="custom-checkbox">
                                  <input type="checkbox" id="checkbox1" name="options[]" value="1" />
                                  <label htmlFor="checkbox1"></label>
                                </span>
                              </td>
                              <td>{i + 1}</td>
                              <td>{item.itemName}</td>
                              <td>{item.unit}</td>
                              <td>{item.Balance}</td>
                              <td>{item.price}</td>
                              <td>{item.cost}</td>
                              <td>{item.createAt}</td>
                              <td>{usertitle(item.createBy)}</td>
                              <td>
                                <a href="#editStockItemModal" className="edit" data-toggle="modal" onClick={() => { setStockItemid(item._id); setitemName(item.itemName); setBalance(item.Balance); setunit(item.unit); setprice(item.price)}}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                <a href="#deleteStockItemModal" className="delete" data-toggle="modal" onClick={() => setStockItemid(item._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                              </td>
                            </tr>
                          )
                        }
                      })}
                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text">المعروض <b>{AllStockItems.length > pagination ? pagination : AllStockItems.length}</b> من <b>{AllStockItems.length}</b> الكل</div>
                    <ul className="pagination">
                      <li onClick={EditPagination} className="page-item disabled"><a href="#">Previous</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">1</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">2</a></li>
                      <li onClick={EditPagination} className="page-item active"><a href="#" className="page-link">3</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">4</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">5</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">Next</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div id="addStockItemModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={(e) => createitem(e, userlogininfo.id)}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه صنف بالمخزن</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>اسم الصنف</label>
                          <input type="text" className="form-control" required onChange={(e) => setitemName(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الوحدة</label>
                          <input type='text' className="form-control" required onChange={(e) => setunit(e.target.value)}></input>
                        </div>
                        <div className="form-group">
                          <label>رصيد افتتاحي</label>
                          <input type='Number' className="form-control" required onChange={(e) => setBalance(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>السعر</label>
                          <input type='Number' className="form-control" required onChange={(e) => {setprice(e.target.value); setcost(e.target.value * Balance)} }/>
                        </div>
                        <div className="form-group">
                          <label>التكلفة</label>
                          <input type='Number' className="form-control" required  defaultValue={cost} readOnly/>
                        </div>
                        <div className="form-group">
                          <label>التاريخ</label>
                          <input type='text' className="form-control" Value={createAt} required readOnly />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-success" value="اضافه" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div id="editStockItemModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={(e)=>editStockItem(e,userlogininfo.id)}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل صنف بالمخزن</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>اسم الصنف</label>
                          <input type="text" className="form-control" defaultValue={itemName} required onChange={(e) => setitemName(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الوحدة</label>
                          <input type='text' className="form-control" defaultValue={unit} required onChange={(e) => setunit(e.target.value)}></input>
                        </div>
                        <div className="form-group">
                          <label>رصيد افتتاحي</label>
                          <input type='Number' className="form-control" defaultValue={Balance} onChange={(e) =>{setBalance(Number(e.target.value)); setcost(e.target.value * price)}} />
                        </div>
                        <div className="form-group">
                          <label>السعر</label>
                          <input type='Number' className="form-control" defaultValue={price} onChange={(e) =>{setprice(Number(e.target.value)); setcost(e.target.value * Balance)}} />
                        </div>
                        <div className="form-group">
                          <label>التكلفة</label>
                          <input type='Number' className="form-control" defaultValue={cost} readOnly/>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-info" value="Save" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div id="deleteStockItemModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteStockItem}>
                      <div className="modal-header">
                        <h4 className="modal-title">حذف منتج</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا السجل؟</p>
                        <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-danger" value="حذف" />
                      </div>
                    </form>
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

export default StockItem