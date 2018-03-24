import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './EventShortInfo.css';
import MarketOutcomes from '../MarketOutcomes/MarketOutcomes.js';
import tokenImg from '../../images/token.svg';

import {
    getMarket,
    showHidePrimaryMarket
} from '../../actions';

const getMarketUrl = 'http://192.168.99.100:8888/sportsbook/market/';

class EventShortInfo extends Component {
    constructor(props) {
        super(props);
        this.handleViewPrimaryMarket = this.handleViewPrimaryMarket.bind(this);
        this.viewEventDetails = this.viewEventDetails.bind(this);
    }

    handleViewPrimaryMarket(primaryMarket) {
        let { showHidePrimaryMarket, getMarket } = this.props;

        if (primaryMarket.outcomes) { // Show/Hide market if there are outcomes (data is already fetched)
            showHidePrimaryMarket(primaryMarket);
        } else { // Get market data if there are no outcomes
            getMarket(getMarketUrl + primaryMarket.marketId, 'footballLiveList');
        }
    }

    viewEventDetails(eventId) {
        eventId && this.props.history.push(`/event/${eventId}`);
    }

    render() {
        let { data, eventsMarkets, priceRepresentation } = this.props;
        let primaryMarket = (eventsMarkets && eventsMarkets[data.eventId] && eventsMarkets[data.eventId][0]) || {};

        if (data.competitors && data.competitors.length === 2 &&
            data.competitors[0].name && data.competitors[1].name &&
            data.scores && data.scores.home !== undefined && data.scores.away !== undefined) {
            return (
                <div>
                    <div className='event-info'>
                        <div className='teams-and-score'>
                            <div className='event-show-primary-market' onClick={this.handleViewPrimaryMarket.bind(this, primaryMarket)}>
                                <img src={tokenImg} alt='Primary Market' title='View Primary Market' />
                            </div>
                            <div className='event-teams' title='View Event Details' onClick={this.viewEventDetails.bind(this, data.eventId)}>
                                {data.competitors[0].name} vs {data.competitors[1].name}
                            </div>
                            <div className='event-score' title='Score'>
                                <div className='score-box'>{data.scores.home} - {data.scores.away}</div>
                            </div>
                        </div>
                        {
                            primaryMarket.outcomes && primaryMarket.isVisible &&
                            <MarketOutcomes data={primaryMarket} priceRepresentation={priceRepresentation} />
                        }
                    </div>
                </div>
            );
        }
        return null;
    }
};

EventShortInfo.propTypes = {
    eventsMarkets: PropTypes.object,
    priceRepresentation: PropTypes.string,
    getMarket: PropTypes.func
};

const mapStateToProps = state => {
    return {
        eventsMarkets: state.appData.get('eventsMarkets').toJS(),
        priceRepresentation: state.appData.get('priceRepresentation')
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getMarket: (marketId, caller) => dispatch(getMarket(marketId, caller)),
        showHidePrimaryMarket: market => dispatch(showHidePrimaryMarket(market))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventShortInfo);
