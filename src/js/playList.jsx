import React from 'react'
import db from './db'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
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


        this.onDragEnd = this.onDragEnd.bind(this)
        this.play = this.play.bind(this)
        this.tick = this.tick.bind(this)
    }

    //  clearTimer : PlayList -> PlayList
    clearTimer() {
        const { intervalId } = this.state

        clearInterval(intervalId)
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

    // commponentWillUnmount : PlayList -> PlayList
    commponentWillUnmount() {
        this.clearTimer()
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

        if (playing) {
            if (systemElapsedTime >29999) {
                clearInterval(intervalId)
                this.sampleOver()
            }

            this.setState({elapsedTime: systemElapsedTime})
        } else {
            this.setState({startTime: startTime + 500})

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

    // onDragEnd : PlayList -> PlayList
    onDragEnd(result) {
        const { destination, source, draggableId } = result;
        if ( !destination || destination.index === source.index ) { return }

        const updatedSongs = this.reorderSongs(source.index, destination.index)

        const updatedSongIdx = this.selectedSongIdx(updatedSongs)
        this.setState({songs: updatedSongs, selectedSongIdx: updatedSongIdx})
    }

    // reorderSongs: PlayList -> Number -> Number -> PlayList
    reorderSongs(startIndex, endIndex) {
        const { songs } = this.state
        const updatedSongs = [...songs]
        const [removedSong] = updatedSongs.splice(startIndex, 1)

        updatedSongs.splice(endIndex, 0, removedSong)

        return updatedSongs
    }

    // render : PlayList -> Object
    render() {
        const countTracks = this.countTracks()
        const playListTimeEnglishFormat = secsToEnglish(this.toSecs())
        const playListTimeClockFormat = secsToHrsMinsSecs(this.toSecs())
        const { playing, selectedSongIdx, songs } = this.state

        const playOnClick = playing ? () => this.pause()
        : () => this.play(selectedSongIdx)

        const trackList = songs.map((song, idx) => {
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
                    <div className='title'
                    onClick={() => this.sortBy('title')}>Title</div>
                    <div className='artist'
                    onClick={() => this.sortBy('artist')}>Artist</div>
                    <div className='album'
                    onClick={() => this.sortBy('album')}>Album</div>
                    <div className='duration'
                    onClick={() => this.sortBy('duration')}>Length</div>
                </li>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId={"droppable"}>
                        {provided => (
                            <div className='trackList'
                            {...provided.droppableProps}
                            ref={provided.innerRef}>
                                { trackList }
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <li className='playList-footer'>
                    <div className='controls'>
                        <i className='material-icons volumeDown'
                        onClick={() => this.volume(-0.1)}>volume_down</i>
                        <i className='material-icons'
                        onClick={() => this.skipPrevious()}>skip_previous</i>
                        <i className='material-icons play' onClick={playOnClick}>
                        {playing ? 'pause_circle_filled' : 'play_arrow'}</i>
                        <i className='material-icons'
                        onClick={() => this.skipNext()}>skip_next</i>
                        <i className='material-icons volumeUp'
                        onClick={() => this.volume(0.1)}>volume_up</i>
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

    // selectSong : PlayList -> Number -> PlayList
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

    // sort : PlayList -> PlayList
    sortBy(key) {
        const { songs } = this.state
        let sorted = [...songs]

        sorted = sorted.sort(function(currentSong, nextSong) {
            const currentKey = currentSong[key].toLowerCase()
            const nextKey = nextSong[key].toLowerCase()

            return (currentKey < nextKey) ? -1 : (currentKey > nextKey) ? 1 : 0
        })

        if ((JSON.stringify(sorted)) === (JSON.stringify(songs))) {
            sorted = sorted.reverse()
        }

        const updatedSongIdx = this.selectedSongIdx(sorted)

        this.setState({songs: sorted, selectedSongIdx: updatedSongIdx})
    }

    selectedSongIdx(trackList) {
        const { songs, selectedSongIdx } = this.state
        const currentSong = songs[selectedSongIdx]
        const songIdx = trackList.findIndex(song => song === currentSong)

        return songIdx

    }

    // startTimer : PlayList -> PlayList
    startTimer() {
        this.clearTimer()

        this.setState({
            intervalId: setInterval(this.tick, 500),
            startTime: this.timeNow()
        })
    }

    // volume: PlayList -> Float -> PlayList
    volume(difference) {
        const level = parseFloat((this.audio.volume).toFixed(2)) + difference
        const validLevel = level <= 1 && level >= 0

        if (validLevel) {
            this.audio.volume = level
            this.audioOver.volume = level
        }
    }
}
