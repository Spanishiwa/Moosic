import React from 'react'
import ReactDOM from 'react-dom'
import PlayList from './playList'
import ContactUs from './contactUs'
import { confirmArrayFrom } from './util'


function Root() {
    confirmArrayFrom()

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
