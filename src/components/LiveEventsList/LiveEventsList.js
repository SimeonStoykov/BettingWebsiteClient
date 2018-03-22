import React from 'react';
import './LiveEventsList.css';
import EventShortInfo from '../EventShortInfo/EventShortInfo.js';
import arrowsImg from '../../images/arrows.png';
import arrowUp from '../../images/up-arrow.svg';
import arrowDown from '../../images/down-arrow.svg';

const LiveEventsList = ({ events, eventsAreLoading, eventsLoadingError, openCloseCompetition }) => {
    return (
        <div className='football-live-box'>
            <div className='football-live-title-box'>
                <img src={arrowsImg} alt='Football Live Arrows' className='live-arrows' />
                <h2 className='football-live-title'>Football Live</h2>
            </div>
            {eventsAreLoading ? 'Loading...' : ''}
            {eventsLoadingError}
            {
                events.map(rec => {
                    return (
                        <div key={rec.competition.id}>
                            <div className={rec.competition.isOpened ? 'competition-title-box opened-competition' : 'competition-title-box'} onClick={() => openCloseCompetition(rec.competition.id)}>
                                <h3 className='competition-title'>{rec.competition.name}</h3>
                                <div className='arrow-wrapper'>
                                    <img src={rec.competition.isOpened ? arrowUp : arrowDown} alt='Open close competition' className='arrow-img' />
                                </div>
                            </div>
                            {
                                rec.competition.isOpened &&
                                rec.eventsData.map(currEvent => {
                                    return <EventShortInfo key={currEvent.eventId} data={currEvent} />;
                                })
                            }
                        </div>
                    );
                })
            }
        </div>
    )
};

export default LiveEventsList;
