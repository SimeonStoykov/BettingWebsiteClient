import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './EventShortInfo.css';
import Market from '../Market/Market.js';
import tokenImg from '../../images/token.svg';

import {
    getMarket
} from '../../actions';

const getMarkettUrl = 'http://192.168.99.100:8888/sportsbook/market/';

class EventShortInfo extends Component {
    render() {
        let { data, eventsMarkets, getMarket } = this.props;
        let primaryMarket = eventsMarkets && eventsMarkets[data.eventId] && eventsMarkets[data.eventId][0];

        if (data.competitors && data.competitors.length === 2 &&
            data.competitors[0].name && data.competitors[1].name &&
            data.scores && data.scores.home !== undefined && data.scores.away !== undefined) {
            return (
                <div>
                    <div className='event-info'>
                        <div className='event-show-primary-market' onClick={() => getMarket(getMarkettUrl + primaryMarket.marketId)}>
                            <img src={tokenImg} alt='Primary Market' title='Primary Market' />
                        </div>
                        <div className='event-teams'>
                            {data.competitors[0].name} vs {data.competitors[1].name}
                        </div>
                        <div className='event-score'>{data.scores.home} - {data.scores.away}</div>
                    </div>
                    {
                        primaryMarket && primaryMarket.outcomes &&
                        <Market data={primaryMarket} />
                    }
                </div>
            );
        }
        return null;
    }
};

EventShortInfo.propTypes = {
    getMarket: PropTypes.func
};

const mapStateToProps = state => {
    return {
        eventsMarkets: state.appData.get('eventsMarkets').toJS()
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getMarket: marketId => dispatch(getMarket(marketId))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventShortInfo);
