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
    }

    // countTracks : PlayList -> Number
    countTracks() {
        return this.state.songs.length
    }

    // play : PlayList -> Number -> PlayList
    play(songIdx) {
        songIdx = songIdx === -1 ? 0 : songIdx

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

    // render : PlayList -> Object
    render() {
        const countTracks = this.countTracks()
        const playListTimeEnglishFormat = secsToEnglish(this.toSecs())
        const playListTimeClockFormat = secsToHrsMinsSecs(this.toSecs())
        const { playing, selectedSongIdx, songs } = this.state

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
                        <i className='material-icons' onClick={playing ? () => this.pause() : () => this.play(selectedSongIdx)}>{playing ? 'pause_circle_outline' : 'play_circle_outline'}</i>
                    </div>
                    <div>Playlist Total Time: {playListTimeEnglishFormat} ({countTracks} songs)</div>
                </li>

                <audio id='audio'></audio>
            </ul>
        )
    }
}
