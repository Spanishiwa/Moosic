import React from 'react'
import { secsToHrsMinsSecs } from './util'

const Song = ({ album,
                artist,
                duration,
                idx,
                onSelection,
                selectedIdx,
                title }) => {
    const durationClockFormat = secsToHrsMinsSecs(duration)
    const className = idx === selectedIdx ? 'active' : ''

    return (
        <li className={className} onClick={() => onSelection(idx)}>
            <div className='title'>{title}</div>
            <div className='duration'>{durationClockFormat}</div>
            <div className='artist'>{artist}</div>
            <div className='album'>{album}</div>
        </li>
    )
}

export default Song
