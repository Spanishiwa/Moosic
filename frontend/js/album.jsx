import React from 'react'
import ReactDOM from 'react-dom'


class Songs extends React.Component {
    render () {
        const selectedSong = this.props.selectedSong
        const songs = Array.from(this.props.album).map((song, idx) => {
            const albumTitle = song.dataset.albumTitle
            const artistTitle = song.dataset.artistTitle
            const songLengthSeconds = song.dataset.songLengthSeconds
            const songTitle = song.dataset.songTitle
            return (
                <li key={idx}>
                    {songTitle}
                    ,{songLengthSeconds}
                    ,{artistTitle}
                    ,{albumTitle}
                </li>
            )
        })

        return (
            <ul>
                {songs}
            </ul>
        )
    }
}

export default class Album extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedSong: 0
        }
    }

    render() {
        const album = document.querySelector('#album-list').children
        const songTitle = album[0].dataset.songTitle
        const songLengthSeconds = album[0].dataset.songLengthSeconds
        const artistTitle = album[0].dataset.artistTitle
        const albumTitle = album[0].dataset.albumTitle

        return (
            <Songs album={album}></Songs>
        )
    }
}
