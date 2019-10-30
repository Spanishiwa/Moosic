import React from 'react'
import { secsToHrsMinsSecs } from './util'

const Song = ({ albumTitle,
                artistTitle,
                durationSecs,
                idx,
                onSelection,
                selectedIdx,
                title }) => {
    const durationClockFormat = secsToHrsMinsSecs(durationSecs)
    const className = idx === selectedIdx ? 'active' : ''

    return (
        <li className={className} onClick={() => onSelection(idx)}>
            <div className='songTitle'>{title}</div>
            <div className='songDuration'>{durationClockFormat}</div>
            <div className='artistTitle'>{artistTitle}</div>
            <div className='albumTitle'>{albumTitle}</div>
        </li>
    )
}

export default Song
