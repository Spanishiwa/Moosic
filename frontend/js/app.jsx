import React from 'react'
import ReactDOM from 'react-dom'
import Album from './album'
import { confirmArrayFrom } from './util'

function Root() {
    confirmArrayFrom();

    return (
        <div>
            <ul>
                <Album />
            </ul>

        </div>
    )
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<Root />, document.getElementById('main-content'))
})
