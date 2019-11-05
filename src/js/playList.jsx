import React from 'react'
import db from './db'
import { secsToEnglish, secsToHrsMinsSecs } from './util'
import Song from './song'


export default class PlayList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            elapsedTime: 0,
            intervalId: [],
            playing: false,
            selectedSongIdx: -1,
            songs: [],
            startTime: 0
        }

        this.play = this.play.bind(this)
        this.tick = this.tick.bind(this)
    }

    // countTracks : PlayList -> Number
    countTracks() {
        const { songs } = this.state
        return songs.length
    }

    // componentDidMount : PlayList -> PlayList
    componentDidMount() {
        const songs = db.songs
        this.setState({songs: songs})
        this.loadSampleOver()
    }

    // loadSampleOver : Playlist -> Playlist
    loadSampleOver() {
        const audioOver = this.audioOver

        audioOver.defaultPlaybackRate = 1.0
        audioOver.src = db.alerts[0].src
    }

    // loadSong: PlayList -> Number -> PlayList
    loadSong(songIdx) {
        const audio = this.audio
        const song = this.state.songs[songIdx]

        audio.defaultPlaybackRate = 1.5
        audio.src = song.src
    }

    // play : PlayList -> Number -> PlayList
    play(songIdx) {
        songIdx = songIdx === -1 ? 0 : songIdx
        const { selectedSongIdx, elapsedTime } = this.state

        if (songIdx !== selectedSongIdx || elapsedTime > 29999) {
            this.setState({elapsedTime: 0})
            this.selectSong(songIdx)
            this.startTimer()
        }

        this.audio.play()
        this.resetSampleOver()
        this.setState({playing: true})
    }

    // pause : Playlist -> Playlist
    pause() {
        this.audio.pause()
        this.setState({playing: false})
    }

    // tick : PlayList -> PlayList
    tick() {
        const { elapsedTime, intervalId, playing, startTime } = this.state
        const systemElapsedTime = Math.floor(((this.timeNow() - startTime)))

        if (systemElapsedTime > 29999) {
            clearInterval(intervalId)
            this.sampleOver()
        } else {
            if (playing) {
                this.setState({elapsedTime: systemElapsedTime})
            } else {
                this.setState({startTime: startTime + 500})

            }
        }

    }

    // timeNow : PlayList -> PlayList
    timeNow() {
        return (new Date()).getTime()
    }

    // PlayList -> Number
    toSecs() {
        const songs = this.state.songs
        const sumDuration = (secsSum, song) => {
            return secsSum + parseInt(song.duration)
        }

        return songs.reduce((sumDuration), 0)
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
            const { artist, album, duration, title } = song
            return (
                <Song
                key={idx}
                artist={artist}
                album={album}
                duration={duration}
                idx={idx}
                selectedIdx={selectedSongIdx}
                onSelection={this.play}
                title={title}
                />
            )
        })

        return (
            <ul className='playList'>
                <li className='playList-header'>
                    <div className='title'>Title</div>
                    <div className='artist'>Artist</div>
                    <div className='album'>Album</div>
                    <div className='duration'>Length</div>
                </li>
                <div className='trackList'>
                    { playList }
                </div>
                <li className='playList-footer'>
                    <div className='controls'>
                        <i className='material-icons'
                        onClick={() => this.skipPrevious()}>skip_previous</i>
                        <i className='material-icons play' onClick={playOnClick}>
                        {playing ? 'pause_circle_filled' : 'play_arrow'}</i>
                        <i className='material-icons'
                        onClick={() => this.skipNext()}>skip_next</i>
                        <p className='sampleTime'>{this.sampleTime()} / 30</p>
                    </div>
                    <div className='mobile'>
                        Playlist Total Time: {playListTimeClockFormat} ({countTracks} songs)
                    </div>
                    <div className='desktop'>
                        Playlist Total Time: {playListTimeEnglishFormat} ({countTracks} songs)
                    </div>
                </li>
                <audio id='audio' ref={(audio) => this.audio = audio}></audio>
                <audio id='audioOver' ref={(audioOver) => this.audioOver = audioOver}></audio>
            </ul>
        )
    }

    // resetSampleOver : PlayList -> PlayList
    resetSampleOver() {
        this.audioOver.pause()
        this.audioOver.currentTime = 0
    }

    // resetSong : PlayList -> PlayList
    resetSong() {
        this.audio.currentTime = 0
    }

    // sampleOver: PlayList -> PlayList
    sampleOver() {
        this.audioOver.play()
        this.pause()
        this.resetSong()
        this.setState({elapsedTime: 30000})
    }


    // sampleTime : PlayList -> PlayList
    sampleTime() {
        const { elapsedTime } = this.state

        return Math.floor((elapsedTime / 1000))
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

    // startTimer : PlayList -> PlayList
    startTimer() {
        const { intervalId, startTime } = this.state
        clearInterval(intervalId)

        this.setState({
            intervalId: setInterval(this.tick, 500),
            startTime: this.timeNow()
        })
    }
}
