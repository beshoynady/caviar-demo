import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { detacontext } from '../../../../App';

const Category = () => {
  const [categoryname, setcategoryname] = useState('')
  const [categoryId, setcategoryId] = useState('')

  const [allCategory, setallCategory] = useState([])

  const getallCategory = async () => {
    const res = await axios.get("https://restaurant-api-blush.vercel.app/api/category/");
    setallCategory(res.data)
  }


  const createCategory = async () => {
    const send = await axios.post("https://restaurant-api-blush.vercel.app/api/category/", { name: categoryname });
  }


  const editCategory = async () => {
    console.log(categoryId)
    try {
      const edit = await axios.put("https://restaurant-api-blush.vercel.app/api/category/" + categoryId, { name: categoryname })
      console.log(edit)
    } catch (error) {
      console.log(error)
    }
  }
  const deleteCategory = async () => {
    try {
      const deleted = await axios.delete("https://restaurant-api-blush.vercel.app/api/category/" + categoryId)
      console.log(categoryId)
      console.log(deleted)
    } catch (error) {
      console.log(error)
    }
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
  useEffect(() => {
    getallCategory()
  }, [])

  return (
    <detacontext.Consumer>
      {
        ({allProducts,calcTotalSalesOfCategory}) => {
          return (
            <div className="container-xl mlr-auto">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6 text-right">
                        <h2>Manage <b>Categorys</b></h2>
                      </div>
                      <div className="col-sm-6 text-left">
                        <a href="#addCategoryModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه تصنيف</span></a>
                        <a href="#deleteCategoryModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
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
                        <th>الاسم</th>
                        <th>عدد المنتجات</th>
                        <th>عدد المنتجات المباعه</th>
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allCategory && allCategory.map((category, index) => {
                        if (index < pagination & index >= pagination - 5) {
                          return (
                            <tr key={index}>
                              <td>
                                <span className="custom-checkbox">
                                  <input type="checkbox" id="checkbox1" name="options[]" value="1" />
                                  <label htmlFor="checkbox1"></label>
                                </span>
                              </td>
                              <td>{index + 1}</td>
                              <td>{category.name}</td>
                              <td>{allProducts?allProducts.filter((pro)=>pro.category == category._id).length:0}</td>
                              <td>{calcTotalSalesOfCategory(category._id)}</td>
                              <td>
                                <a href="#editCategoryModal" className="edit" data-toggle="modal" onClick={() => setcategoryId(category._id)}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

                                <a href="#deleteCategoryModal" className="delete" data-toggle="modal" onClick={() => setcategoryId(category._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                              </td>
                            </tr>
                          )
                        }
                      })}

                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text">Showing <b>{allCategory.length > pagination ? pagination : allCategory.length}</b> out of <b>{allCategory.length}</b> entries</div>
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
              <div id="addCategoryModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={createCategory}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه تصنيف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>الاسم</label>
                          <input type="text" className="form-control" required onChange={(e) => setcategoryname(e.target.value)} />
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
              <div id="editCategoryModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={editCategory}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل التصنيف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>الاسم</label>
                          <input type="text" className="form-control" required onChange={(e) => setcategoryname(e.target.value)} />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-info" value="حفظ" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div id="deleteCategoryModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteCategory}>
                      <div className="modal-header">
                        <h4 className="modal-title">حذف تصنيف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا التصنيف?</p>
                        <p className="text-warning"><small>لا يمكن الرجوع فيه.</small></p>
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

export default Category