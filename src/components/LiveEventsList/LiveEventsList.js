import React from 'react';
import './LiveEventsList.css';
import EventShortInfo from '../EventShortInfo/EventShortInfo.js';
import arrowsImg from '../../images/arrows.png';
import arrowUp from '../../images/up-arrow.svg';
import arrowDown from '../../images/down-arrow.svg';

const LiveEventsList = ({ competitions, eventsAreLoading, eventsLoadingError, openCloseCompetition, primaryMarkets }) => {
    return (
        <div className='football-live-box'>
            <div className='football-live-title-box'>
                <img src={arrowsImg} alt='Football Live Arrows' className='live-arrows' />
                <h2 className='football-live-title'>Football Live</h2>
            </div>
            {eventsAreLoading ? 'Loading...' : ''}
            {eventsLoadingError}
            {
                competitions.map(rec => {
                    return (
                        <div key={rec.id}>
                            <div className={rec.isOpened ? 'competition-title-box opened-competition' : 'competition-title-box'} onClick={() => openCloseCompetition(rec.id)}>
                                <h3 className='competition-title'>{rec.name}</h3>
                                <div className='arrow-wrapper'>
                                    <img src={rec.isOpened ? arrowUp : arrowDown} alt='Open close competition' className='arrow-img' />
                                </div>
                            </div>
                            {
                                rec.isOpened &&
                                rec.events.map(currEvent => {
                                    let primaryMarket = (primaryMarkets && primaryMarkets[currEvent.eventId] && primaryMarkets[currEvent.eventId][0]) || null;
                                    return <EventShortInfo key={currEvent.eventId} data={currEvent} primaryMarket={primaryMarket} />;
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
