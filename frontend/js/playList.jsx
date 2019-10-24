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
                <div className='songTitle'>{title}</div>
                <div className='songDuration'>{durationClockFormat}</div>
                <div className='artistTitle'>{artistTitle}</div>
                <div className='albumTitle'>{albumTitle}</div>
            </li>
        )
    }
}

export default class PlayList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            elapsedTime: 0
            , intervalId: []
            , playing: false
            , selectedSongIdx: -1
            , songs: []
            , startTime: 0
        }

        this.pause = this.pause.bind(this)
        this.play = this.play.bind(this)
        this.selectSong = this.selectSong.bind(this)
        this.skipNext = this.skipNext.bind(this)
        this.skipPrevious = this.skipPrevious.bind(this)
        this.tick = this.tick.bind(this)
    }

    // countTracks : PlayList -> Number
    countTracks() {
        return this.state.songs.length
    }

    // componentDidMount : PlayList -> PlayList
    componentDidMount() {
        const songs = Array.from(document.querySelector('#playListData').children)
        this.setState({songs: songs})

        this.loadSampleOver()
    }

    // loadSampleOver : Playlist -> Playlist
    loadSampleOver() {
        const audioOver = document.getElementById('audioOver')

        audioOver.defaultPlaybackRate = 1.0
        audioOver.src = './frontend/sounds/30s-is-over.wav'
    }

    // loadSong: PlayList -> Number -> PlayList
    loadSong(songIdx) {
        const audio = document.getElementById('audio')
        const song = this.state.songs[songIdx]

        audio.defaultPlaybackRate = 1.5
        audio.src = song.dataset.mp3Src
    }

    // play : PlayList -> Number -> PlayList
    play(songIdx) {
        songIdx = songIdx === -1 ? 0 : songIdx
        const { selectedSongIdx, elapsedTime } = this.state

        if (songIdx !== selectedSongIdx || elapsedTime > 27500) {
            this.selectSong(songIdx)
            this.startTimer()
        }

        this.resetSampleOver()

        document.getElementById('audio').play()
        this.setState({playing: true})
    }

    // pause : Playlist -> Playlist
    pause() {
        const audio = document.getElementById('audio')
        audio.pause()

        this.setState({playing: false})
    }

    resetSong() {
        document.getElementById('audio').currentTime = 0
    }

    sampleOver() {
        this.pause()
        this.resetSong()
        document.getElementById('audioOver').play()

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
        clearInterval(this.state.intervalId)

        this.setState({
            intervalId: setInterval(this.tick, 2000)
            , startTime: this.timeNow()
        })
    }

    // tick : PlayList -> PlayList
    tick() {
        const elapsedTime = this.timeNow() - this.state.startTime

        if (elapsedTime > 29999) {
            console.log('30s passed');
            clearInterval(this.state.intervalId)
            this.sampleOver();
        } else {
            if (!this.state.playing) {
                const pausedTime = elapsedTime - this.state.elapsedTime
                this.setState({startTime: this.state.startTime + pausedTime})
            } else {
                this.setState({elapsedTime: elapsedTime})
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
        const songDurationSecs = (secsSum, song) => {
            return secsSum + parseInt(song.dataset.songDurationSecs)
        }

        return songs.reduce((songDurationSecs), 0)
    }

    // resetSampleOver : PlayList -> PlayList
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
                <div className='trackList'>
                    {playList}
                </div>
                <li className='playList-footer'>
                    <div className='controls'>
                        <i className='material-icons'
                        onClick={() => this.skipPrevious()}>skip_previous</i>
                        <i className='material-icons play' onClick={playOnClick}>
                        {playing ? 'pause_circle_filled' : 'play_arrow'}</i>
                        <i className='material-icons'
                        onClick={() => this.skipNext()}>skip_next</i>
                    </div>
                    <div className='mobile'>Playlist Total Time: {playListTimeClockFormat} ({countTracks} songs)</div>
                    <div className='desktop'>Playlist Total Time: {playListTimeEnglishFormat} ({countTracks} songs)</div>
                </li>
                <audio id='audio'></audio>
                <audio id='audioOver'></audio>
            </ul>
        )
    }
}
