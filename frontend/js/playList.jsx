import React from 'react'
import ReactDOM from 'react-dom'
import { secsToEnglish, secsToHrsMinsSecs } from './util'


class Song extends React.Component {
    // render : PlayList -> Object
    render () {
        const klass = this.props.idx === this.props.selectedIdx ? 'active' : ''
        const durationClockFormat = secsToHrsMinsSecs(this.props.durationSecs)

        return (
            <li
            className={klass}
            onClick={() => this.props.onSelection(this.props.idx)}
            >
                <div className='sm9 m4'>{this.props.title}</div>
                <div className='sm3 m2'>{durationClockFormat}</div>
                <div className='sm6 m3'>{this.props.artistTitle}</div>
                <div className='sm6 m3'>{this.props.albumTitle}</div>
            </li>
        )
    }
}

export default class PlayList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            playing: false
            , selectedSongIdx: -1
            , songs: this.props.songs
        }

        this.selectSong = this.selectSong.bind(this)
        this.play = this.play.bind(this)
        this.pause = this.pause.bind(this)
    }

    // countTracks : PlayList -> Number
    countTracks() {
        return this.state.songs.length
    }

    // play : PlayList -> Number -> PlayList
    play(songIdx) {
        this.selectSong(songIdx)
        document.getElementById('audio').play()
        this.setState({playing: true})
    }

    // pause : Playlist -> Playlist
    pause() {
        document.getElementById('audio').pause()
        this.setState({playing: false})
    }

    // selectSong : PlayList -> PlayList
    selectSong(songIdx) {
        this.setState({selectedSongIdx: songIdx})
        this.loadAudio(songIdx)
    }

    // PlayList -> PlayList
    loadAudio(songIdx) {
        const audio = document.getElementById('audio')
        const song = this.state.songs[songIdx]

        audio.defaultPlaybackRate = 1.5
        audio.src = song.dataset.mp3Src
    }

    // PlayList -> Number
    toSecs() {
        const songs = this.state.songs
        const songDurationSecs = (secsSum, song) => {
            return secsSum + parseInt(song.dataset.songDurationSecs)
        }

        return songs.reduce((songDurationSecs), 0)
    }

    // render : Object -> Object
    render() {
        const countTracks = this.countTracks()
        const playListTimeEnglishFormat = secsToEnglish(this.toSecs())
        const playListTimeClockFormat = secsToHrsMinsSecs(this.toSecs())
        const songs = this.state.songs

        const playList = songs.map((song, idx) => {
            return (
                <Song
                key={idx}
                artistTitle={song.dataset.artistTitle}
                albumTitle={song.dataset.albumTitle}
                durationSecs={song.dataset.songDurationSecs}
                idx={idx}
                selectedIdx={this.state.selectedSongIdx}
                onSelection={this.play}
                title={song.dataset.songTitle}
                ></Song>
            )
        })

        return (
            <ul className='playList'>
                {playList}
                <li className='controls'>
                    <div className='sm1 m1'>
                        <i
                        className='material-icons'
                        onClick={this.pause}>pause_circle_outline</i>
                    </div>
                    <div>Playlist Total Time: {playListTimeEnglishFormat} ({countTracks} songs)</div>
                </li>

                <audio id='audio'></audio>
            </ul>
        )
    }
}
