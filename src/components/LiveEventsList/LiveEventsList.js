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

import {
    fetchEvents,
    openCloseCompetition
} from '../../actions';

const eventsUrl = 'http://192.168.99.100:8888/football/live?primaryMarkets=true';

class LiveEventsList extends Component {
    constructor(props) {
        super(props);
        this.handleCompetitionTitleClick = this.handleCompetitionTitleClick.bind(this);
    }

    componentDidMount() {
        this.props.fetchEvents(eventsUrl);

        this.props.ws.onmessage = e => {
            let response = JSON.parse(e.data);
            console.log(response);

            //CHECK IF WE HAVE SELECTED EVENT AND UPDATE ITS OUTCOMES IF WE HAVE AND THAN CHECK IF WE HAVE THE OUTCOME IN THE EVENTSMARKETS OBJECT AND UPDATE IT THERE

            switch (response.type) {
                case 'PRICE_CHANGE': {
                    let data = response.data;
                    let eventId = data.eventId.toString();

                    // let markets = state.getIn(['eventsMarkets', eventId]).toJS();
                    // let primaryMarket = markets[0];

                    // if (primaryMarket && primaryMarket.outcomes) {
                    //     for (let i = 0; primaryMarket.outcomes.length; i++) {
                    //         let currentOutcome = primaryMarket.outcomes[i];
                    //         if (currentOutcome.outcomeId === data.outcomeId) {
                    //             return state.setIn(['eventsMarkets', eventId, 0, 'outcomes', i, 'price'], data.price);
                    //         }
                    //     }
                    // }

                    // return state;

                    // let event = state.getIn('eventsMarkets', e.data.eventId).toJS();
                    // console.log(event);
                }
                    break;
                default:
                    break;
            }
        };
    }

    componentWillUnmount() {
        console.log('unmount live list');
        this.props.ws.send(JSON.stringify({type: 'unsubscribe'}));
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
        eventsLoadingError: state.appData.get('eventsLoadingError')
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchEvents: url => dispatch(fetchEvents(url)),
        openCloseCompetition: competition => dispatch(openCloseCompetition(competition))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LiveEventsList);
