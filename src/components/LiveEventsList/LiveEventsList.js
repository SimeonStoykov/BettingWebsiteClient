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
        this.toggleCompetition = this.toggleCompetition.bind(this);
    }

    componentDidMount() {
        this.props.fetchEvents(eventsUrl);
    }

    toggleCompetition(id) {
        this.props.openCloseCompetition(id);
    }

    render() {
        let { competitions, eventsAreLoading, eventsLoadingError, history } = this.props;

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
                { eventsLoadingError &&
                    <div className='events-loading-error-wrapper'>
                        <img src={error} alt='Error' className='error-img' />
                        <div className='events-loading-error-text'>{eventsLoadingError}</div> 
                    </div>
                    
                }
                {
                    competitions.map(rec => {
                        return (
                            <div key={rec.id}>
                                <div className={rec.isOpened ? 'accordion-box opened-accordion' : 'accordion-box'} onClick={this.toggleCompetition.bind(this, rec.id)}>
                                    <h3 className='accordion-title'>{rec.name}</h3>
                                    <div className='accordion-arrow-wrapper'>
                                        <img src={rec.isOpened ? arrowUp : arrowDown} alt='Open close competition' className='arrow-img' />
                                    </div>
                                </div>
                                {
                                    rec.isOpened &&
                                    rec.events.map(currEvent => {
                                        return <EventShortInfo key={currEvent.eventId} data={currEvent} history={history} />;
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
