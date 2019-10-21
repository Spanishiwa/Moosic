import React from 'react'
import ReactDOM from 'react-dom'
import PlayList from './playList'
import { confirmArrayFrom } from './util'


function Root() {
    confirmArrayFrom()
    const songs = document.querySelector('#playListData').children

    return (
        <PlayList songs={songs} />
    )
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<Root />, document.getElementById('main-content'))
})
