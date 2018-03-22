import React from 'react';
import './EventShortInfo.css';

const EventShortInfo = ({ data }) => {
    if (data.competitors && data.competitors.length === 2 &&
        data.competitors[0].name && data.competitors[1].name &&
        data.scores && data.scores.home !== undefined && data.scores.away !== undefined) {
        return (
            <div className='event-info'>
                <div className='event-teams'>{data.competitors[0].name} vs {data.competitors[1].name}</div>
                <div className='event-score'>{data.scores.home} - {data.scores.away}</div>
            </div>
        );
    }
    return null;
};

export default EventShortInfo;
