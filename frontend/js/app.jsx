import React from 'react'
import ReactDOM from 'react-dom'
import PlayList from './playList'
import { confirmArrayFrom } from './util'


function Root() {
    confirmArrayFrom()

    return (
        <PlayList />
    )
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<Root />, document.getElementById('main-content'))
})
