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
    openCloseMarket
} from '../../actions';

const getEventUrl = 'http://192.168.99.100:8888/sportsbook/event/';
const getMarkettUrl = 'http://192.168.99.100:8888/sportsbook/market/';

class EventDetails extends Component {
    constructor(props) {
        super(props);
        this.handleMarketAccordionClick = this.handleMarketAccordionClick.bind(this);
    }

    componentDidMount() {
        let eventId = this.props.match && this.props.match.params && this.props.match.params.id;
        this.props.getEvent(getEventUrl + eventId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.props.getEvent(getEventUrl + nextProps.match.params.id);
        }
    }

    handleMarketAccordionClick(market) {
        let { openCloseMarket, getMarket } = this.props;

        if (market.outcomes) { // Outcomes are already fetched, just open/close the window
            openCloseMarket(market.marketId);
        } else { // Fetch outcomes for the market
            getMarket(getMarkettUrl + market.marketId, 'selectedEvent');
        }
    }

    render() {
        let { history, selectedEvent, priceRepresentation } = this.props;

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
                        <LiveEventsList history={this.props.history} />
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
        openCloseMarket: market => dispatch(openCloseMarket(market))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventDetails);
