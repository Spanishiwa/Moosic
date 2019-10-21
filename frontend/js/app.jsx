import React from 'react'
import ReactDOM from 'react-dom'
import Album from './album'


function Root() {
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
