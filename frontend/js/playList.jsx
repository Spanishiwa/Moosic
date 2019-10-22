import React from 'react'
import ReactDOM from 'react-dom'


class Song extends React.Component {
    // render : PlayList -> Object
    render () {
        const klass = this.props.idx === this.props.selectedIdx ? 'active' : ''

        return (
            <li
            className={klass}
            onClick ={() => this.props.onSelection(this.props.idx)}>
                {this.props.title}
                ,{this.props.durationSeconds}
                ,{this.props.artistTitle}
                ,{this.props.albumTitle}
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

    // render : Object -> Object
    render() {
        const playList = Array.from(this.state.songs).map((song, idx) => {
            return (
                <Song
                key={idx}
                artistTitle={song.dataset.artistTitle}
                albumTitle={song.dataset.albumTitle}
                durationSeconds={song.dataset.songDurationSeconds}
                idx={idx}
                selectedIdx={this.state.selectedSongIdx}
                onSelection={this.selectSong}
                title={song.dataset.songTitle}
                ></Song>
            )
        })

        return (
            <ul className="playList">{playList}</ul>
        )
    }
}
