import React from 'react'
import { Draggable } from "react-beautiful-dnd";
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
        <Draggable key={idx} draggableId={idx.toString()} index={idx}>
            {provided => (
                <li className={className}
                onClick={() => onSelection(idx)}
                ref={provided.innerRef}
                id={`yesyes${idx}`}
                {...provided.draggableProps}
                {...provided.dragHandleProps}>
                    <div className='title'>{title}</div>
                    <div className='duration'>{durationClockFormat}</div>
                    <div className='artist'>{artist}</div>
                    <div className='album'>{album}</div>
                </li>
            )}
        </Draggable>
    )
}

export default Song
