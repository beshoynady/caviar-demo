import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App'
import { toast, ToastContainer } from 'react-toastify';



const KitchenConsumption = () => {
  const [itemName, setitemName] = useState('');
  const [stockItemId, setstockItemId] = useState('');
  const [stockItemName, setstockItemName] = useState('');
  const [quantityTransferredToKitchen, setquantityTransferredToKitchen] = useState();
  const [createBy, setcreateBy] = useState('');
  const [unit, setunit] = useState('');
  
  const [Balance, setBalance] = useState('');
  const [price, setprice] = useState('');
  const [totalCost, settotalCost] = useState('');
  const [parts, setparts] = useState('');
  const [costOfPart, setcostOfPart] = useState('');
  const [minThreshold, setminThreshold] = useState();

 // Function to add an item to kitchen consumption
const addKitchenItem = async (e) => {
  e. preventDefault() 
  try {
    // Make a POST request to add an item
    const response = await axios.post('https://caviar-api.vercel.app/api/kitchenconsumption', {
      stockItemId,
      stockItemName,
      quantityTransferredToKitchen,
      unit,
      createBy
    });

    // Check if the item was added successfully
    if (response.status === 201) {
      getkitchenconsumption()
      // Show a success toast if the item is added
      toast.success('Item added successfully');
    } else {
      // Show an error toast if adding the item failed
      toast.error('Failed to add item');
    }
  } catch (error) {
    // Show an error toast if an error occurs during the request
    toast.error('Failed to add item');
    console.error(error);
  }
};

// const updateKitchenItem = async (e) => {
//   e.preventDefault()
//   console.log('updateKitchenItem')
//   try {
//     listOfOrders.map((order) => {
//       const listoforderproducts = order.products;
//       // console.log({listoforderproducts:listoforderproducts})

//       listoforderproducts.map((orderproduct) => {
//         console.log({orderproduct:orderproduct})
//         listofProducts.map((product) => {
//           console.log({listoforderproducts:orderproduct.productid})
//           console.log({listofProducts:product._id })
//           if (product._id == orderproduct.productid) {
//             const listofrecipe = product.Recipe;

//             listofrecipe.map((recipe) => {
//               console.log({recipe:recipe})
              
//               Allkitchenconsumption.map(async (item) => {
//                 console.log({Allkitchenconsumption:item})
//                 if (item.stockItemId == recipe.itemId) {
//                   const consumptionQuantity = consumptionQuantity + (recipe.amount * orderproduct.quantity);
//                   const balance = item.quantityTransferredToKitchen - consumptionQuantity;
//                   const productsProduced = item.productsProduced;

//                   productsProduced.map(async (p) => {
//                     console.log({productsProduced:p})

//                     if (p.productId === orderproduct.productid) {
//                       p.productionCount = p.productionCount + orderproduct.quantity;

//                       try {
//                         const update = await axios.put(`https://caviar-api.vercel.app/api/kitchenconsumption/${item.itemid}`, {
//                           consumptionQuantity,
//                           balance,
//                           productsProduced,
//                         });
//                         console.log('Update successful:', update.data);
//                         // Add toast for successful update
//                         toast.success('Updated kitchen consumption successfully');
//                       } catch (error) {
//                         console.error('Update error:', error);
//                         // Add toast for update error
//                         toast.error('Failed to update kitchen consumption');
//                       }
//                     } else {
//                       productsProduced.push({ productId: orderproduct.productid });
//                       productsProduced.push({ productName: orderproduct.name });
//                       productsProduced.push({ productionCount: orderproduct.quantity });

//                       try {
//                         const update = await axios.put(`https://caviar-api.vercel.app/api/kitchenconsumption/${item.itemid}`, {
//                           consumptionQuantity,
//                           balance,
//                           productsProduced,
//                         });
//                         console.log('Update push successful:', update.data);
//                         // Add toast for successful update
//                         toast.success('Updated kitchen consumption successfully');
//                       } catch (error) {
//                         console.error('Update error:', error);
//                         // Add toast for update error
//                         toast.error('Failed to update kitchen consumption');
//                       }
//                     }
//                   });
//                 }else{
//                   console.log('Allkitchenconsumption item.stockItemId === recipe')

//                 }
//               });
//             });
//           }else {
//             console.log('product._id === orderproduct.productid')
//           }
//         });
//       });
//     });
//   } catch (error) {
//     console.error('Error occurred:', error);
//     // Add toast for error
//     toast.error('An error occurred');
//   }
// };

// const updateKitchenItem = async (e) => {
//   e.preventDefault();
//   console.log('updateKitchenItem');

//   try {
//     for (const order of listOfOrders) {
//       const listoforderproducts = order.products;

//       for (const orderproduct of listoforderproducts) {
//         console.log({ orderproduct: orderproduct });

//         for (const product of listofProducts) {
//           console.log({ listoforderproducts: orderproduct.productid });
//           console.log({ listofProducts: product._id });

//           if (product._id == orderproduct.productid) {
//             const listofrecipe = product.Recipe;

//             for (const recipe of listofrecipe) {
//               console.log({ recipe: recipe });

//               for (const item of Allkitchenconsumption) {
//                 console.log({ Allkitchenconsumption: item });

//                 if (item.stockItemId == recipe.itemId) {
//                   let consumptionQuantity = 0; // Initialize consumption quantity here
//                   const productsProduced = item.productsProduced;

//                   for (const p of productsProduced) {
//                     console.log({ productsProduced: p });

//                     if (p.productId === orderproduct.productid) {
//                       p.productionCount += orderproduct.quantity;
//                     } else {
//                       productsProduced.push({
//                         productId: orderproduct.productid,
//                         productName: orderproduct.name,
//                         productionCount: orderproduct.quantity,
//                       });
//                     }

//                     consumptionQuantity += recipe.amount * orderproduct.quantity;
//                     const balance = item.quantityTransferredToKitchen - consumptionQuantity;

//                     try {
//                       const update = await axios.put(`https://caviar-api.vercel.app/api/kitchenconsumption/${item.itemid}`, {
//                         consumptionQuantity,
//                         balance,
//                         productsProduced,
//                       });
//                       console.log('Update successful:', update.data);
//                       // Add toast for successful update
//                       toast.success('Updated kitchen consumption successfully');
//                     } catch (error) {
//                       console.error('Update error:', error);
//                       // Add toast for update error
//                       toast.error('Failed to update kitchen consumption');
//                     }
//                   }
//                 } else {
//                   console.log('Allkitchenconsumption item.stockItemId === recipe');
//                 }
//               }
//             }
//           } else {
//             console.log('product._id === orderproduct.productid');
//           }
//         }
//       }
//     }
//   } catch (error) {
//     console.error('Error occurred:', error);
//     // Add toast for error
//     toast.error('An error occurred');
//   }
// };


  const [listOfOrders, setlistOfOrders] = useState([])
  // Fetch orders from API
  const getAllOrders = async () => {
    try {
      const res = await axios.get('https://caviar-api.vercel.app/api/order');
      setlistOfOrders(res.data.reverse());
    } catch (error) {
      console.log(error);
      // Display toast or handle error
    }
  };


  const [AllStockItems, setAllStockItems] = useState([])
  // Function to retrieve all stock items
  const getStockItems = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/stockitem/');

      if (response.status === 200) {
        const stockItems = response.data.reverse();
        setAllStockItems(stockItems);
        console.log(response.data);
      } else {
        // Handle other statuses if needed
        console.log(`Unexpected status code: ${response.status}`);
        toast.error('Failed to retrieve stock items');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to retrieve stock items');
    }
  };


  // const [AllCategoryStock, setAllCategoryStock] = useState([])
  // // Function to retrieve all category stock
  // const getAllCategoryStock = async () => {
  //   try {
  //     const res = await axios.get('https://caviar-api.vercel.app/api/categoryStock/');
  //     setAllCategoryStock(res.data);
  //   } catch (error) {
  //     console.log(error);

  //     // Notify on error
  //     toast.error('Failed to retrieve category stock');
  //   }
  // };

const [listofProducts, setlistofProducts] = useState([]);

  const getallproducts = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/product/');
      const products = await response.data;
      // console.log(response.data)
      setlistofProducts(products)
      // console.log(listofProducts)

    } catch (error) {
      console.log(error)
    }

  }
  const [Allkitchenconsumption, setkitchenconsumption] = useState([]);

  const getkitchenconsumption = async () => {
    try {
      console.log('getkitchenconsumption');
      const response = await axios.get('https://caviar-api.vercel.app/api/kitchenconsumption');
      if (response) {
        setkitchenconsumption(response.data.data);
        console.log(response.data);
      } else {
        console.log('Unexpected status code:', response.status);
        // Handle other statuses if needed
      }
    } catch (error) {
      console.error('Error fetching kitchen consumption:', error);
      // Handle error: Notify user, log error, etc.
    }
  };



  const searchByKitchenConsumption = (name) => {
    const filteredKitchenConsumption = Allkitchenconsumption.filter((item) => item.stockItemName.startsWith(name) == true);
    setAllkitchenconsumption(filteredKitchenConsumption);
  };
  


  useEffect(() => {
    getStockItems()
    getAllOrders()
    getallproducts()
    
    getkitchenconsumption()
  }, [])

  return (
    <detacontext.Consumer>
      {
        ({ employeeLoginInfo, usertitle, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <ToastContainer />
              <div className="table-responsive mt-1">
                <div className="table-wrapper p-3 mw-100">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6 text-right">
                        <h2>ادارة <b>الاستهلاك</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addItemModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه منتج جديد</span></a>

                        <a href="#updateItemModal" className="btn btn-danger" data-toggle="modal" ><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
                      </div>
                    </div>
                  </div>
                  <div class="table-filter">
                    <div class="row text-dark">
                      <div class="col-sm-3">
                        <div class="show-entries">
                          <span>عرض</span>
                          <select class="form-control" onChange={(e) => { setstartpagination(0); setendpagination(e.target.value) }}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={25}>25</option>
                            <option value={30}>30</option>
                          </select>
                          <span>صفوف</span>
                        </div>
                      </div>
                      <div class="col-sm-9">
                        <button type="button" class="btn btn-primary"><i class="fa fa-search"></i></button>
                        <div class="filter-group">
                          <label>اسم الصنف</label>
                          <input type="text" class="form-control" onChange={(e) => searchByKitchenConsumption(e.target.value)} />
                        </div>
                        <div class="filter-group">
                          <label>اختر الصنف</label>
                          <select class="form-control" onChange={(e) => searchByKitchenConsumption(e.target.value)} >
                            <option value={""}>الكل</option>
                            {Allkitchenconsumption.map((consumption) =>{
                              return (<option value={consumption.stockItemName}>{consumption.stockItemName}</option>)
                            })}
                          </select>
                        </div>
                        {/* <div class="filter-group">
                          <label>Location</label>
                          <select class="form-control">
                            <option>All</option>
                            <option>Berlin</option>
                            <option>London</option>
                            <option>Madrid</option>
                            <option>New York</option>
                            <option>Paris</option>
                          </select>
                        </div>
                        <div class="filter-group">
                          <label>Status</label>
                          <select class="form-control">
                            <option>Any</option>
                            <option>Delivered</option>
                            <option>Shipped</option>
                            <option>Pending</option>
                            <option>Cancelled</option>
                          </select>
                        </div>
                        <span class="filter-icon"><i class="fa fa-filter"></i></span> */}
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
                        <th>الكمية المضافه</th>
                        <th>الاستهلاك</th>
                        <th>الوحدة</th>
                        <th>الرصيد</th>
                        <th>التسويه</th>
                        <th>المنتجات</th>
                        <th>بواسطه</th>
                        <th>تاريخ الاضافه</th>
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                      Allkitchenconsumption.length >0? Allkitchenconsumption.map((item, i) => {
                        if (i >= startpagination & i < endpagination) {
                          return (
                            <tr key={i}>
                              <td>
                                <span className="custom-checkbox">
                                  <input type="checkbox" id="checkbox1" name="options[]" value="1" />
                                  <label htmlFor="checkbox1"></label>
                                </span>
                              </td>
                              <td>{i + 1}</td>
                              <td>{item.stockItemName}</td>
                              <td>{item.quantityTransferredToKitchen}</td>
                              <td>{item.consumptionQuantity}</td>
                              <td>{item.unit}</td>
                              <td>{item.balance}</td>
                              <td>{item.adjustment}</td>
                              <td>
                                {item.productsProduced.length>0? item.productsProduced.map((product, j) => (
                                  <span key={j}>{`[${product.productionCount} * ${product.productName}]`}</span>
                                )):'لا يوجد'}
                              </td>
                              <td>{item.createBy ? usertitle(item.createBy) : '--'}</td>
                              <td>{item.createdAt}</td>
                              <td>
                                <a href="#editStockItemModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                <a href="#deleteStockItemModal" className="delete" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                              </td>
                            </tr>
                          );
                        }
                      }):""}
                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{Allkitchenconsumption.length > endpagination ? endpagination : Allkitchenconsumption.length}</b> من <b>{Allkitchenconsumption.length}</b> عنصر</div>
                    <ul className="pagination">
                      <li onClick={EditPagination} className="page-item disabled"><a href="#">السابق</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">1</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">2</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">3</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">4</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">5</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">التالي</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div id="addItemModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={(e) => addKitchenItem(e)}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه صنف </h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        
                        <div className="form-group">
                          <label>الصنف</label>
                          <select name="category" id="category" form="carform" onChange={(e) => {setstockItemId(e.target.value);setunit(AllStockItems.filter(stock=>stock._id == e.target.value)[0].smallUnit);setcreateBy(employeeLoginInfo.employeeinfo.id); setstockItemName(AllStockItems.filter(it => it._id == e.target.value)[0].itemName)}}>
                            <option>اختر الصنف</option>
                            {AllStockItems.map((StockItems, i) => {
                              return <option value={StockItems._id} key={i} >{StockItems.itemName}</option>
                            })
                            }
                          </select>
                        </div>
                        <div className="form-group">
                          <label>رصيد محول</label>
                          <input type='Number' className="form-control" required onChange={(e) => setquantityTransferredToKitchen(Number(e.target.value))} />
                        </div>
                        <div className="form-group">
                          <label>الوحدة </label>
                          <input type='text' className="form-control" required defaultValue={unit}></input>
                        </div>
                        <div className="form-group">
                          <label>التاريخ</label>
                          <input type='text' className="form-control" Value={new Date().toLocaleDateString()} required readOnly />
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
                            {/* 
              <div id="editStockItemModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={(e) => editStockItem(e, employeeLoginInfo.employeeinfo.id)}>
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
                          <label>نوع المخزن</label>
                          <select name="category" id="category" defaultValue={categoryId} form="carform" onChange={(e) => setcategoryId(e.target.value)}>
                            <option>{AllCategoryStock.length>0?AllCategoryStock.filter(c=>c._id == categoryId)[0].name:''}</option> */}
              {/* {AllCategoryStock.map((category, i) => {
                              return <option value={category._id} key={i} >{category.name}</option>
                            })
                            }
                          </select>
                        </div>

                        <div className="form-group">
                          <label>الوحدة الكبيرة</label>
                          <input type='text' className="form-control" defaultValue={largeUnit} required onChange={(e) => setlargeUnit(e.target.value)}></input>
                        </div>
                        <div className="form-group">
                          <label>الوحدة الصغيره</label>
                          <input type='text' className="form-control" defaultValue={smallUnit} required onChange={(e) => setsmallUnit(e.target.value)}></input>
                        </div>
                        <div className="form-group">
                          <label>رصيد افتتاحي</label>
                          <input type='Number' className="form-control" defaultValue={Balance} required onChange={(e) => setBalance(e.target.value)} />
                        </div>
                        <div className="form-group">
                              <label>الحد الادني</label>
                              <input type='number' className="form-control" required defaultValue={minThreshold} onChange={(e) => { setminThreshold(e.target.value); }} />
                            </div>

                        <div className="form-group">
                          <label>السعر</label>
                          <input type='Number' className="form-control" defaultValue={price} required onChange={(e) => { setprice(e.target.value); settotalCost(e.target.value * Balance) }} />
                        </div>
                        <div className="form-group">
                          <label>التكلفة</label>
                          <input type='text' className="form-control" required defaultValue={totalCost} readOnly />
                        </div>
                        <div className="form-group">
                          <label>عدد الوحدات</label>
                          <input type='Number' className="form-control" defaultValue required onChange={(e) => { setparts(e.target.value); setcostOfPart(price / e.target.value) }} />
                        </div>
                        <div className="form-group">
                          <label>تكلفة الوحده</label>
                          <input type='Number' className="form-control" required defaultValue={costOfPart} readOnly />
                        </div>
                        <div className="form-group">
                          <label>التاريخ</label>
                          <input type='text' className="form-control" defaultValue={new Date().toLocaleDateString()} required readOnly />
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
                        */}

              {/* <div id="updateItemModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={updateKitchenItem}>
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
                        <input type="submit" className="btn btn-danger" value="تحديث" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>   */}
              
            </div>
          )
        }
      }
    </detacontext.Consumer>

  )
}

export default KitchenConsumption