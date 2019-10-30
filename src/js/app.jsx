import React from 'react'
import ReactDOM from 'react-dom'
import ContactUs from './contactUs'
import PlayList from './playList'


function Root() {
    return (
        <div>
            <PlayList />
            <ContactUs />
        </div>

    )
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<Root />, document.getElementById('main-content'))
})
