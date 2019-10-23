import React from 'react'
import ReactDOM from 'react-dom'
import { secsToEnglish, secsToHrsMinsSecs } from './util'


class Song extends React.Component {
    // render : PlayList -> Object
    render () {
        const klass = this.props.idx === this.props.selectedIdx ? 'active' : ''

        return (
            <li
            className={klass}
            onClick={() => this.props.onSelection(this.props.idx)}
            >
                <div className="sm9 m4">{this.props.title}</div>
                <div className="sm3 m2">{this.props.durationSecs}</div>
                <div className="sm6 m3">{this.props.artistTitle}</div>
                <div className="sm6 m3">{this.props.albumTitle}</div>
            </li>
        )
    }
}

export default class PlayList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedSongIdx: -1
            , songs: this.props.songs
        }

        this.selectSong = this.selectSong.bind(this)
    }

    selectSong(idx) {
        this.setState({selectedSongIdx: idx})
    }

    // PlayList -> Number
    toSecs() {
        const songs = Array.from(this.state.songs)
        const songDurationSecs = (secsSum, song) => {
            return secsSum + parseInt(song.dataset.songDurationSecs)
        }

        return songs.reduce((songDurationSecs), 0)
    }

    countTracks() {
        const songs = Array.from(this.state.songs)

        return songs.length
    }

    // render : Object -> Object
    render() {
        const playListTimeToEnglish = secsToEnglish(this.toSecs())
        const playListTimeToClock = secsToHrsMinsSecs(this.toSecs())
        const countTracks = this.countTracks()

        const playList = Array.from(this.state.songs).map((song, idx) => {
            return (
                <Song
                key={idx}
                artistTitle={song.dataset.artistTitle}
                albumTitle={song.dataset.albumTitle}
                durationSecs={song.dataset.songDurationSecs}
                idx={idx}
                selectedIdx={this.state.selectedSongIdx}
                onSelection={this.selectSong}
                title={song.dataset.songTitle}
                ></Song>
            )
        })

        return (
            <ul className="playList">
                {playList}
                <li>Playlist Total Time: {playListTimeToEnglish} ({countTracks} songs)</li>
                <li>Playlist Total Time (Clock format): {playListTimeToClock} ({countTracks} songs)</li>
            </ul>
        )
    }
}
