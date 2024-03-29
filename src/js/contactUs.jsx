import React from 'react'

const ContactUs = () => {
    return (
        <div className='contactUs'>
            <h3>Contact Us</h3>
            <p>Want to send Moosic some feedback or find out where we're playing next? Send us a message!</p>
            <form>
                <ul className='formWrapper'>
                    <li>
                        <label htmlFor='formName'>Name</label>
                        <input id='formName' type='text' name='name' placeholder='John Smith' />
                    </li>
                    <li>
                        <label htmlFor='formCompany'>Company</label>
                        <input id='formCompany' type='text' name='company' placeholder='Moosic, LLC' />
                    </li>
                    <li>
                        <label htmlFor='formEmail'>Email</label>
                        <input id='formEmail' type='text' name='email' placeholder='example@gmail.com' />
                    </li>
                    <li>
                        <label htmlFor='formSubject'>Subject</label>
                        <input id='formSubject' type='text' name='subject' placeholder='Fan Mail'/>
                    </li>
                    <li>
                        <label htmlFor='formDescription'>Description</label>
                        <textarea id='formDescription' type='text' placeholder='Let us know the reason for contacting us' rows='6' />
                    </li>
                    <li>
                        <input id='formSubmit' type='submit' value='Submit' />
                    </li>
                </ul>
            </form>
        </div>
    )
}

export default ContactUs
