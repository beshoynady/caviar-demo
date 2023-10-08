import './Orders.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { detacontext } from '../../../../App'


const Orders = () => {

  const formatdate =(d)=>{
    let date =new Date(d)
    let form_dt = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return form_dt;
  }
  const [pagination, setpagination] = useState(5)
  const EditPagination = (e) => {
    if (e.target.innerHTML == 'Next') {
      setpagination(pagination + 5)
    } else if (e.target.innerHTML == 'Previous') {
      if (pagination <= 5) {
        setpagination(5)
      } else {
        setpagination(pagination - 5)
      }
    } else {
      setpagination(e.target.innerHTML * 5)
    }
  }

  const [listofoeders, setlistofoeders] = useState([])
  const getorders = async () => {
    const res = await axios.get('https://restaurant-api-blush.vercel.app/api/order')
    setlistofoeders(res.data)
  }
  const [orederid, setorederid] = useState()
  const deletorder = async()=>{
    console.log(orederid)
    const id = orederid;
    await axios.delete('https://restaurant-api-blush.vercel.app/api/order/'+id).then((res)=>console.log(res.data))
    getorders()
  }

  

  useEffect(() => {
    getorders()
  }, [])
  return (
    <detacontext.Consumer>
      {
        ({askingForHelp ,userlogininfo, usertitle}) => {
  return (
    <div className="container-xl mlr-auto">
      <div className="table-responsive">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-6">
                <h2>ادارة <b>الاوردرات</b></h2>
              </div>
              <div className="col-sm-6 ">
                <a href="#addOrderModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافة اوردر جديد</span></a>
                <a href="#deleteOrderModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
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
                <th>رقم الاوردر</th>
                <th>العميل</th>
                <th>الاجمالي</th>
                <th>حالة الطلب</th>
                <th>حالة الدفع</th>
                <th>تاريخ الدفع</th>
                <th>اجراءات</th>
              </tr>
            </thead>
            <tbody>
              {listofoeders.map((o, i) => {
                if (i < pagination & i >= pagination - 5) {
                  return (
                    <tr key={i}>
                      <td>
                        <span className="custom-checkbox">
                          <input type="checkbox" id="checkbox1" name="options[]" value="1" />
                          <label htmlFor="checkbox1"></label>
                        </span>
                      </td>
                      <td>{i+1}</td>
                      <td>{o.serial}</td>
                      <td>{o.table!=null?usertitle(o.table) : usertitle(o.customer)}</td>
                      <td>{o.total}</td>                      
                      <td>{o.status}</td>                      
                      <td>{o.payment_status}</td>                      
                      <td>{formatdate(o.payment_date)}</td>                      
                      <td>
                        <a href="#editOrderModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                        <a href="#deleteOrderModal" className="delete" data-toggle="modal" onClick={()=>setorederid(o._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                      </td>
                    </tr>
                  )
                }
              })}

            </tbody>
          </table>
          <div className="clearfix">
            <div className="hint-text">Showing <b>{listofoeders.length > pagination ? pagination : listofoeders.length}</b> out of <b>{listofoeders.length}</b> entries</div>
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
      <div id="addOrderModal" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <form>
              <div className="modal-header">
                <h4 className="modal-title"></h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea className="form-control" required></textarea>
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="text" className="form-control" required />
                </div>
              </div>
              <div className="modal-footer">
                <input type="button" className="btn btn-danger" data-dismiss="modal" value="Cancel" />
                <input type="submit" className="btn btn-success" value="Add" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div id="editOrderModal" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <form>
              <div className="modal-header">
                <h4 className="modal-title">Edit Order</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea className="form-control" required></textarea>
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="text" className="form-control" required />
                </div>
              </div>
              <div className="modal-footer">
                <input type="button" className="btn btn-danger" data-dismiss="modal" value="Cancel" />
                <input type="submit" className="btn btn-info" value="Save" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div id="deleteOrderModal" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={deletorder}>
              <div className="modal-header">
                <h4 className="modal-title">Delete Order</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body">
                <p>هل انت متاكد من حذف هذا السجل؟?</p>
                <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
              </div>
              <div className="modal-footer">
                <input type="button" className="btn btn-danger" data-toggle="modal" data-dismiss="modal" value="Cancel" />
                <input type="submit" className="btn btn-danger" value="Delete" />
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

export default Orders