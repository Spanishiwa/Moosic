import React from 'react'
import ReactDOM from 'react-dom'


export default class Album extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedSong: 0
        }
    }

    render() {
        const album = document.querySelector('#album-list')
        const songTitle = album.children[0].dataset.songTitle
        const songLengthSeconds = album.children[0].dataset.songLengthSeconds
        const artistTitle = album.children[0].dataset.artistTitle
        const albumTitle = album.children[0].dataset.albumTitle

        return (
            <li>{songTitle} {songLengthSeconds} {artistTitle} {albumTitle}</li>
        )
    }
}
