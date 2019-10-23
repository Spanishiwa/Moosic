import React from 'react'
import ReactDOM from 'react-dom'
import { secsToEnglish, secsToHrsMinsSecs } from './util'


class Song extends React.Component {
    // render : PlayList -> Object
    render () {
        const { albumTitle, artistTitle, durationSecs, idx
        , onSelection, selectedIdx, title } = this.props
        const klass = idx === selectedIdx ? 'active' : ''
        const durationClockFormat = secsToHrsMinsSecs(durationSecs)

        return (
            <li className={klass} onClick={() => onSelection(idx)}>
                <div className='sm9 m4'>{title}</div>
                <div className='sm3 m2'>{durationClockFormat}</div>
                <div className='sm6 m3'>{artistTitle}</div>
                <div className='sm6 m3'>{albumTitle}</div>
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
        this.skipNext = this.skipNext.bind(this)
        this.skipPrevious = this.skipPrevious.bind(this)
    }

    // countTracks : PlayList -> Number
    countTracks() {
        return this.state.songs.length
    }

    // PlayList -> PlayList
    loadSong(songIdx) {
        const audio = document.getElementById('audio')
        const song = this.state.songs[songIdx]

        audio.defaultPlaybackRate = 1.5
        audio.src = song.dataset.mp3Src
    }

    // play : PlayList -> Number -> PlayList
    play(songIdx) {
        songIdx = songIdx === -1 ? 0 : songIdx

        if (songIdx !== this.state.selectedSongIdx) {
            this.selectSong(songIdx)
        }

        this.resetSampleOver()

        document.getElementById('audio').play()
        this.setState({playing: true})
    }

    // pause : Playlist -> Playlist
    pause() {
        document.getElementById('audio').pause()
        this.setState({playing: false})
    }

    playSampleOver() {
        const audioOver = document.getElementById('audioOver')

        this.pause()
        document.getElementById('audio').currentTime = 0

        audioOver.defaultPlaybackRate = 1.0
        audioOver.src = './frontend/sounds/30s-is-over.wav'
        audioOver.play()

    }

    // selectSong : PlayList -> PlayList
    selectSong(songIdx) {
        this.setState({selectedSongIdx: songIdx})
        this.loadSong(songIdx)
    }

    // skipNext : PlayList -> PlayList
    skipNext() {
        const { selectedSongIdx } = this.state
        const isAtLoopPoint = selectedSongIdx >= this.countTracks() - 1 ||
        selectedSongIdx < 0

        const songIdx = isAtLoopPoint ? 0 : (selectedSongIdx + 1)

        this.selectSong(songIdx)
        this.play(songIdx)
    }

    // skipPrevious : PlayList -> PlayList
    skipPrevious() {
        const { selectedSongIdx } = this.state
        const songIdx = selectedSongIdx < 1 ? (this.countTracks() - 1)
        : selectedSongIdx -1

        this.selectSong(songIdx)
        this.play(songIdx)
    }

    // PlayList -> Number
    toSecs() {
        const songs = this.state.songs
        const songDurationSecs = (secsSum, song) => {
            return secsSum + parseInt(song.dataset.songDurationSecs)
        }

        return songs.reduce((songDurationSecs), 0)
    }

    // PlayList -> PlayList
    resetSampleOver() {
        document.getElementById('audioOver').pause()
        document.getElementById('audioOver').currentTime = 0
    }

    // render : PlayList -> Object
    render() {
        const countTracks = this.countTracks()
        const playListTimeEnglishFormat = secsToEnglish(this.toSecs())
        const playListTimeClockFormat = secsToHrsMinsSecs(this.toSecs())
        const { playing, selectedSongIdx, songs } = this.state
        const playOnClick = playing ? () => this.pause()
        : () => this.play(selectedSongIdx)

        const playList = songs.map((song, idx) => {
            const { artistTitle, albumTitle, songDurationSecs, songTitle } = song.dataset
            return (
                <Song
                key={idx}
                artistTitle={artistTitle}
                albumTitle={albumTitle}
                durationSecs={songDurationSecs}
                idx={idx}
                selectedIdx={selectedSongIdx}
                onSelection={this.play}
                title={songTitle}
                ></Song>
            )
        })

        return (
            <ul className='playList'>
                {playList}
                <li className='controls'>
                    <div className='sm1 m1'>
                        <i className='material-icons'
                        onClick={() => this.skipPrevious()}>skip_previous</i>
                        <i className='material-icons' onClick={playOnClick}>
                        {playing ? 'pause_circle_filled' : 'play_arrow'}</i>
                        <i className='material-icons'
                        onClick={() => this.skipNext()}>skip_next</i>
                    </div>
                    <div>Playlist Total Time: {playListTimeEnglishFormat} ({countTracks} songs)</div>
                </li>
                <audio id='audio'></audio>
                <audio id='audioOver'></audio>
            </ul>
        )
    }
}
