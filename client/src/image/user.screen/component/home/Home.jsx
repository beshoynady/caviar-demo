import React from 'react'
import './Home.css'

const Home = () => {
  return (
    <main className='main-home'>
      <div className="container">
        <div className="content">
          <div className='title'>
            <p>مرحبا بكم في</p>
            <h1>كافيار للمأكولات البحرية <br/>Caviar Seafood</h1>
          </div>
          <div className="main-btn">
            <ul>
              <li><a href=''>طلب الويتر</a></li>
              <li><a href=''>المنيو</a></li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home