import React from 'react'
import './Contact.css'

const Contact = () => {
    return (
        <section className='contact' id='contact'>
            <div className="container">
                <div className="left">
                    <form action="">
                        <label htmlFor="name">name :</label>
                        <input type="text" id='name' />
                        <label htmlFor="email">e_mail :</label>
                        <input type="email" id='email' />
                        <label htmlFor="phone">phone :</label>
                        <input type="tel" id='phone' />
                        <label htmlFor="sup">supject :</label>
                        <textarea type="text" id='supject' />
                    </form>
                </div>
                <div className="right">
                    <p>0100000000 : رقم الموبايل</p>
                    <p> صفجتنا علي الفيس بوك
                        <a href='https://www.facebook.com/Caviarseafood2'>كافيار للمأكولات البحرية Caviar Seafood
                        </a></p>
                    <p>واتس: 0111111111</p>
                </div>
            </div>
        </section>
    )
}

export default Contact