import React from 'react'
import './Kit_card.css'

const Kit_card = () => {
  return (
    <div className='kitcard'>
      <div className='kit-card-info'>
        <p><span class="material-symbols-outlined">
          table_restaurant
        </span>الطاولة</p>
        <p><span class="material-symbols-outlined">
          list_alt
        </span>رقم الطلب</p>
        <p><span class="material-symbols-outlined">
          hourglass_top
        </span>الانتظار</p>
        <p><span class="material-symbols-outlined">
          timelapse
        </span>التحضير</p>
      </div>
      <div className="kit-card-order">
        <ul className='kit-card-order-item'>
          <li className='order-item-li'>
            <p className='item-li-name'>ٍسمك بلطي</p>
            <p className='item-li-cont'>* 5</p>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Kit_card