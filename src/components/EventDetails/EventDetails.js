import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../Header/Header.js';
import LiveEventsList from '../LiveEventsList/LiveEventsList.js';
import MarketOutcomes from '../MarketOutcomes/MarketOutcomes.js';
import './EventDetails.css';
import arrowUp from '../../images/up-arrow.svg';
import arrowDown from '../../images/down-arrow.svg';
import spinner from '../../images/spinner.svg';
import error from '../../images/error.svg';

import {
    getEvent,
    getMarket,
    openCloseMarket,
    clearSelectedEvent
} from '../../actions';

const getEventUrl = 'http://192.168.99.100:8888/sportsbook/event/';
const getMarketUrl = 'http://192.168.99.100:8888/sportsbook/market/';

class EventDetails extends Component {
    constructor(props) {
        super(props);
        this.handleMarketAccordionClick = this.handleMarketAccordionClick.bind(this);
    }

    componentDidMount() {
        let { match, getEvent, ws } = this.props;
        let eventId = match && match.params && match.params.id;

        Promise.resolve()
            .then(getEvent(getEventUrl + eventId))
            .then(() => {
                ws.onopen = () => ws.send(JSON.stringify({ type: 'subscribe', keys: [`e.${eventId}`], clearSubscription: false }));
                ws.readyState === 1 && ws.send(JSON.stringify({ type: 'subscribe', keys: [`e.${eventId}`], clearSubscription: false }));
            });
    }

    componentWillUnmount() {
        let { match, ws, clearSelectedEvent } = this.props;
        let eventId = this.props.match && this.props.match.params && this.props.match.params.id;
        eventId && ws.send(JSON.stringify({ type: 'unsubscribe', keys: [`e.${eventId}`] }));
        console.log('unmount');
        clearSelectedEvent();
    }

    componentWillReceiveProps(nextProps) {
        let currEventId = this.props.match.params.id;
        let nextEventId = nextProps.match.params.id;

        if (nextEventId !== currEventId) {
            Promise.resolve()
                .then(nextProps.getEvent(getEventUrl + nextEventId))
                .then(() => {
                    nextProps.ws.send(JSON.stringify({ type: 'unsubscribe', keys: [`e.${currEventId}`] }));
                    nextProps.ws.send(JSON.stringify({ type: 'subscribe', keys: [`e.${nextEventId}`], clearSubscription: false }));
                });
        }
    }

    handleMarketAccordionClick(market) {
        let { openCloseMarket, getMarket } = this.props;

        if (market.outcomes) { // Outcomes are already fetched, just open/close the window
            openCloseMarket(market.marketId);
        } else { // Fetch outcomes for the market
            getMarket(getMarketUrl + market.marketId, 'selectedEvent')
        }
    }

    render() {
        let { history, selectedEvent, priceRepresentation, ws } = this.props;

        let homeTeamName = '';
        let awayTeamName = '';

        if (selectedEvent.competitors && selectedEvent.competitors.constructor === Array) {
            let homeTeam = selectedEvent.competitors.find(rec => rec.position === 'home');
            let awayTeam = selectedEvent.competitors.find(rec => rec.position === 'away');
            homeTeam && homeTeam.name && (homeTeamName = homeTeam.name);
            awayTeam && awayTeam.name && (awayTeamName = awayTeam.name);
        }

        let eventTypeName = selectedEvent.typeName === 'Football Live' ? 'Other' : selectedEvent.typeName;

        let startedDateTime = new Date(selectedEvent.startTime);
        let displayedDateTime = '';
        if (startedDateTime instanceof Date) {
            displayedDateTime = startedDateTime.toUTCString();
        }

        let homeTeamScore = '';
        let awayTeamScore = '';
        if (selectedEvent.scores) {
            selectedEvent.scores.home !== undefined && (homeTeamScore = selectedEvent.scores.home);
            selectedEvent.scores.away !== undefined && (awayTeamScore = selectedEvent.scores.away);
        }

        return (
            <div>
                <Header history={history} />
                <div className='event-details-wrapper'>
                    <div className='event-details'>
                        <section className='event-teams-info'>
                            <h4 className='event-category'>{selectedEvent.className} / {selectedEvent.linkedEventTypeName || eventTypeName}</h4>
                            <h3 className='event-teams-names'>{`${homeTeamName} vs ${awayTeamName}`}</h3>
                            <h4 className='event-started-datetime'>Started on: {displayedDateTime}</h4>
                        </section>
                        <section className='event-score-info'>
                            <div className='event-score-info-score-line'>
                                <div className='home-team-score-line'>{homeTeamName}</div>
                                <div className='home-team-score'>{homeTeamScore}</div>
                                <div className='away-team-score'>{awayTeamScore}</div>
                                <div className='away-team-score-line'>{awayTeamName}</div>
                            </div>
                        </section>
                        <section className='event-markets'>
                            <h2>Markets</h2>
                            {
                                selectedEvent.markets.map(m => {
                                    return (
                                        <div key={m.marketId} className='event-market'>
                                            <div className={m.isOpened ? 'accordion-box opened-accordion' : 'accordion-box'} onClick={this.handleMarketAccordionClick.bind(this, m)}>
                                                <h3 className='accordion-title'>{m.name}</h3>
                                                <div className='accordion-arrow-wrapper'>
                                                    <img src={m.isOpened ? arrowUp : arrowDown} alt='Open close market' className='arrow-img' />
                                                </div>
                                            </div>
                                            {
                                                m.isOpened && m.outcomes &&
                                                <MarketOutcomes data={m} priceRepresentation={priceRepresentation} />
                                            }
                                        </div>
                                    );
                                })
                            }
                        </section>
                    </div>
                    <div className='event-details-football-live-list'>
                        <LiveEventsList history={history} ws={ws} />
                    </div>
                </div>
            </div>
        );
    }
}

EventDetails.propTypes = {
    getEvent: PropTypes.func,
    getMarket: PropTypes.func,
    openCloseMarket: PropTypes.func
};

const mapStateToProps = state => {
    return {
        selectedEvent: state.appData.get('selectedEvent').toJS(),
        priceRepresentation: state.appData.get('priceRepresentation')
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getEvent: url => dispatch(getEvent(url)),
        getMarket: (marketId, caller) => dispatch(getMarket(marketId, caller)),
        openCloseMarket: market => dispatch(openCloseMarket(market)),
        clearSelectedEvent: () => dispatch(clearSelectedEvent())
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventDetails);
