import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useReactToPrint } from 'react-to-print';



const Tables = () => {
  const [pagination, setpagination] = useState(5)
  const EditPagination = (e) => {
    if (e.target.innerHTML === 'Next') {
      setpagination(pagination + 5)
    } else if (e.target.innerHTML === 'Previous') {
      if (pagination <= 5) {
        setpagination(5)
      } else {
        setpagination(pagination - 5)
      }
    } else {
      setpagination(e.target.innerHTML * 5)
    }
  }

  const [tableid, settableid] = useState("")
  const [qrimage, setqrimage] = useState("")
  const createQR = async (e) => {
    e.preventDefault();
    const URL = `https://${window.location.hostname}/${tableid}`;
    const qr = await axios.post('https://restaurant-api-blush.vercel.app/api/table/qr', { URL });
    // console.log(qr.data);
    setqrimage(qr.data);
  }

  const [listoftable, setlistoftable] = useState([])
  const getallTable = async () => {
    try {
      const response = await axios.get('https://restaurant-api-blush.vercel.app/api/table');
      setlistoftable(response.data)
      // console.log(response.data)
      // console.log(listoftable)
    } catch (error) {
      console.log(error)
    }
  }

  const [tablenum, settablenum] = useState(0);
  const [chairs, setchairs] = useState(0);
  const [tabledesc, settabledesc] = useState("");

  const createTable = async (e) => {
    e.preventDefault()
    // console.log(tabledesc);
    // console.log(tablenum);
    // console.log(chairs)
    try {
      const response = await axios.post('https://restaurant-api-blush.vercel.app/api/table/', { "description": tabledesc, tablenum, chairs });
      console.log(response.data);
      getallTable();
    } catch (error) {
      console.log(error)
    }
  }

  const editTable = async (e) => {
    e.preventDefault()
    // console.log(tabledesc);
    // console.log(tablenum);
    // console.log(chairs)
    try {
      const response = await axios.put(`https://restaurant-api-blush.vercel.app/api/table/${tableid}`, { "description": tabledesc, tablenum, chairs });
      console.log(response.data);
      getallTable();
    } catch (error) {
      console.log(error)
    }
  }

  const deleteTable = async (e) => {
    e.preventDefault()
    // console.log(tableid)
    try {
      const response = await axios.delete(`https://restaurant-api-blush.vercel.app/api/table/${tableid}`);
      console.log(response.data);
      settableid(null);
      getallTable();
    } catch (error) {
      console.log(error)
    }
  }

  const printtableqr = useRef()
  const handlePrint = useReactToPrint({
    content: () => printtableqr.current,
    copyStyles: true,
    removeAfterPrint: true,
  });

  useEffect(() => {
    getallTable()
  }, [pagination])

  return (
    <div className="container-xl mlr-auto">
      <div className="table-responsive">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-6">
                <h2>ادارة <b>الطاولات</b></h2>
              </div>
              <div className="col-sm-6">
                <a href="#addTableModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه طاولة جديدة</span></a>
                <a href="#deleteTableModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
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
                <th>رقم الطاولة</th>
                <th>الوصف</th>
                <th>عدد المقاعد</th>
                {/* <th>الحجز</th> */}
                <th>QR</th>
                <th>اجراءات</th>
              </tr>
            </thead>
            <tbody>
              {listoftable.map((t, i) => {
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
                      <td>{t.tablenum}</td>
                      <td>{t.description}</td>
                      <td>{t.chairs}</td>
                      {/* <td>{t.reservation ? "Reserved" : "Unreserved"}</td> */}
                      <td><a href="#qrTableModal" className="edit" data-toggle="modal" onClick={() => { settableid(t._id); settablenum(t.tablenum) }}>
                        <span className="material-symbols-outlined" data-toggle="tooltip" title="QR">qr_code_2_add</span>
                      </a></td>
                      <td>
                        <a href="#editTableModal" className="edit" data-toggle="modal" onClick={() => { settableid(t._id); settablenum(t.tablenum); setchairs(t.chairs); settabledesc(t.description) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

                        <a href="#deleteTableModal" className="delete" data-toggle="modal" onClick={() => settableid(t._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                      </td>
                    </tr>
                  )
                }
              })}
            </tbody>
          </table>
          <div className="clearfix">
            <div className="hint-text">Showing <b>{listoftable.length > pagination ? pagination : listoftable.length}</b> out of <b>{listoftable.length}</b> entries</div>
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
      {listoftable && <div id="addTableModal" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={createTable}>
              <div className="modal-header">
                <h4 className="modal-title">اضافه طاولة</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>رقم الطاولة</label>
                  <input type="Number" defaultValue={listoftable.length > 0 ? listoftable[listoftable.length - 1].tablenum : ""} className="form-control" required onChange={(e) => settablenum(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>عدد المقاعد</label>
                  <input type="Number" className="form-control" required onChange={(e) => setchairs(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>الوصف</label>
                  <textarea className="form-control" required onChange={(e) => settabledesc(e.target.value)}></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                <input type="submit" className="btn btn-success" value="ضافه" />
              </div>
            </form>
          </div>
        </div>
      </div>}
      {tableid && <div id="editTableModal" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={editTable}>
              <div className="modal-header">
                <h4 className="modal-title">تعديل طاولة</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>رقم الطاولة</label>
                  <input type="Number" defaultValue={listoftable.length > 0 ? listoftable[listoftable.length - 1].tablenum : ""} className="form-control" required onChange={(e) => settablenum(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>عدد المقاعد</label>
                  <input type="Number" defaultValue={listoftable.length > 0 ? listoftable.find((t, i) => t._id == tableid).chairs : ''} className="form-control" required onChange={(e) => setchairs(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>الوصف</label>
                  <textarea defaultValue={listoftable.length > 0 ? listoftable.find((t, i) => t._id == tableid).description : ""} className="form-control" required onChange={(e) => settabledesc(e.target.value)}></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                <input type="submit" className="btn btn-info" value="حفظ" />
              </div>
            </form>
          </div>
        </div>
      </div>}

      <div id="qrTableModal" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={createQR}>
              <div className="modal-header">
                <h4 className="modal-title">استخراج QR</h4>
              </div>
              <div className="modal-body">
                <div ref={printtableqr} style={{width: "100%", height: "100%",display: 'flex', alignItems: 'center', justifyContent: 'center'  }} className="form-group">

                  <div style={{width: "100%", height: "100%",display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',alignContent:'center', marginTop:'10px'}}>

                    <p style={{width:'100%',height:'40px', textAlign: 'center', fontSize: '26px',fontFamily: 'Noto Nastaliq Urdu , serif' }}>طاولة رقم {tablenum}</p>
                    {qrimage && <a href={qrimage} download>
                      <img src={qrimage} style={{ width: "350px", height: "350px"}} className='qrprint'/>
                    </a>}

                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {qrimage?<button type="button" className="btn btn-info" onClick={handlePrint}>طباعه</button>
                :<input type="submit" className="btn btn-success" value="استخراج" />}
                <input type="button" className="btn btn-danger" data-dismiss="modal" value="اغلاق" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div id="deleteTableModal" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={deleteTable}>
              <div className="modal-header">
                <h4 className="modal-title">حذف طاولة</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body">
                <p>هل انت متاكد من حذف هذا السجل؟?</p>
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

export default Tables