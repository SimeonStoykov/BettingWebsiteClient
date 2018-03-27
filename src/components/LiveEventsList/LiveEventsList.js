import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import EventShortInfo from '../EventShortInfo/EventShortInfo.js';
import arrowsImg from '../../images/arrows.png';
import arrowUp from '../../images/up-arrow.svg';
import arrowDown from '../../images/down-arrow.svg';
import spinner from '../../images/spinner.svg';
import error from '../../images/error.svg';
import './LiveEventsList.css';

import { config } from '../../config';

import {
    fetchEvents,
    openCloseCompetition,
    updateOutcomeData
} from '../../actions';

const eventsUrl = `http://${config.host}:8888/football/live?primaryMarkets=true`;

function updateData({ response, eventsMarkets, selectedEvent, updateFunction, updatedValue }) {
    let data = response.data;
    let eventId = data.eventId.toString();

    // Check if the current updated outcome is part of primary market with outcomes (loaded primary market)
    let currEventMarkets = eventsMarkets[eventId];

    if (currEventMarkets) {
        let indexOfMarket = currEventMarkets.map(rec => rec.marketId).indexOf(data.marketId);
        if (indexOfMarket > -1 && currEventMarkets[indexOfMarket].outcomes) {
            let indexOfOutcome = currEventMarkets[indexOfMarket].outcomes.map(o => o.outcomeId).indexOf(data.outcomeId);
            indexOfOutcome > -1 && updateFunction({ eventId, indexOfMarket, indexOfOutcome, [updatedValue]: data[updatedValue], type: 'primaryMarket', updatedValue });
        }
    }

    // Check if the current updated outcome is part of the selected event and updated it there
    let selectedEventId = selectedEvent.eventId && selectedEvent.eventId.toString();

    if (selectedEventId && selectedEventId === eventId) {
        let indexOfMarket = selectedEvent.markets.findIndex(rec => rec.marketId === data.marketId);

        if (indexOfMarket !== -1 && selectedEvent.markets[indexOfMarket].outcomes) {
            let indexOfOutcome = selectedEvent.markets[indexOfMarket].outcomes.findIndex(rec => rec.outcomeId === data.outcomeId);
            indexOfOutcome !== -1 && updateFunction({ eventId, indexOfMarket, indexOfOutcome, [updatedValue]: data[updatedValue], type: 'selectedEvent', updatedValue });
        }
    }
}

class LiveEventsList extends Component {
    constructor(props) {
        super(props);
        this.handleCompetitionTitleClick = this.handleCompetitionTitleClick.bind(this);
    }

    componentDidMount() {
        let { fetchEvents, ws, updateOutcomeData } = this.props;

        fetchEvents(eventsUrl);

        ws.onmessage = e => {
            let response = JSON.parse(e.data);

            switch (response.type) {
                case 'PRICE_CHANGE':
                    updateData({
                        response,
                        eventsMarkets: this.props.eventsMarkets,
                        selectedEvent: this.props.selectedEvent,
                        updateFunction: updateOutcomeData,
                        updatedValue: 'price'
                    });
                    break;
                case 'OUTCOME_STATUS':
                    updateData({
                        response,
                        eventsMarkets: this.props.eventsMarkets,
                        selectedEvent: this.props.selectedEvent,
                        updateFunction: updateOutcomeData,
                        updatedValue: 'status'
                    });
                    break;
                default:
                    break;
            }
        };
    }

    componentWillUnmount() {
        this.props.ws.send(JSON.stringify({ type: 'unsubscribe' }));
    }

    handleCompetitionTitleClick(id) {
        this.props.openCloseCompetition(id);
    }

    render() {
        let { competitions, eventsAreLoading, eventsLoadingError, history, ws } = this.props;

        return (
            <div className='football-live-box'>
                <div className='football-live-title-box'>
                    <img src={arrowsImg} alt='Football Live Arrows' className='live-arrows' />
                    <h2 className='football-live-title'>Football Live</h2>
                </div>
                {
                    eventsAreLoading &&
                    <div className='loading'>
                        <img src={spinner} alt='Loading...' className='spinner-img' />
                        <div>Loading...</div>
                    </div>
                }
                {eventsLoadingError &&
                    <div className='events-loading-error-wrapper'>
                        <img src={error} alt='Error' className='error-img' />
                        <div className='events-loading-error-text'>{eventsLoadingError}</div>
                    </div>
                }
                {
                    competitions.map(rec => {
                        return (
                            <div key={rec.id}>
                                <div className={rec.isOpened ? 'accordion-box opened-accordion' : 'accordion-box'} onClick={this.handleCompetitionTitleClick.bind(this, rec.id)}>
                                    <h3 className='accordion-title'>{rec.name}</h3>
                                    <div className='accordion-arrow-wrapper'>
                                        <img src={rec.isOpened ? arrowUp : arrowDown} alt='Open close competition' className='arrow-img' />
                                    </div>
                                </div>
                                {
                                    rec.isOpened &&
                                    rec.events.map(currEvent => {
                                        return <EventShortInfo key={currEvent.eventId} data={currEvent} history={history} ws={ws} />;
                                    })
                                }
                            </div>
                        );
                    })
                }
            </div>
        );
    }
};


LiveEventsList.propTypes = {
    competitions: PropTypes.array,
    eventsAreLoading: PropTypes.bool,
    eventsLoadingError: PropTypes.string,
    fetchEvents: PropTypes.func,
    openCloseCompetition: PropTypes.func
};

const mapStateToProps = state => {
    return {
        competitions: state.appData.get('competitions').toJS(),
        eventsAreLoading: state.appData.get('eventsAreLoading'),
        eventsLoadingError: state.appData.get('eventsLoadingError'),
        eventsMarkets: state.appData.get('eventsMarkets').toJS(),
        selectedEvent: state.appData.get('selectedEvent').toJS()
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchEvents: url => dispatch(fetchEvents(url)),
        openCloseCompetition: competition => dispatch(openCloseCompetition(competition)),
        updateOutcomeData: data => dispatch(updateOutcomeData(data))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LiveEventsList);
