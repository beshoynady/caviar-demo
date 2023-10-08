import React from 'react'

const addcreatedBy = ({setaddboolean, addboolean}) => {
  return (
    <div id="addcreatedByModal" className="modalsout">
        <div className="modal-dialog">
        <div className="modal-content">
            <form>
            <div className="modal-header">						
                <h4 className="modal-title">اضافة منتج جديد</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={()=>console.log(addboolean)}>&times;</button>
            </div>
            <div className="modal-body">					
                <div className="form-group">
                <label>الاسم</label>
                <input type="text" className="form-control" required/>
                </div>
                <div className="form-group">
                <label>التصنف</label>
                <input type="email" className="form-control" required/>
                </div>
                <div className="form-group">
                <label>السعر</label>
                <textarea className="form-control" required></textarea>
                </div>
                <div className="form-group">
                <label>الصورة</label>
                <input type="file" className="form-control" required/>
                </div>					
            </div>
            <div className="modal-footer">
                <input type="button" className="btn btn-danger" data-dismiss="modal" value="Cancel"/>
                <input type="submit" className="btn btn-success" value="Add"/>
            </div>
            </form>
        </div>
        </div>
    </div>
  )
}

export default addcreatedBy