import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../Header/Header.js';
import LiveEventsList from '../LiveEventsList/LiveEventsList.js';
import './EventDetails.css';

import {
    getEvent
} from '../../actions';

const getEventUrl = 'http://192.168.99.100:8888/sportsbook/event/';

class EventDetails extends Component {
    componentDidMount() {
        let eventId = this.props.match && this.props.match.params && this.props.match.params.id;
        this.props.getEvent(getEventUrl + eventId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.props.getEvent(getEventUrl + nextProps.match.params.id);
        }
    }

    render() {
        let { history, selectedEvent } = this.props;

        return (
            <div>
                <Header history={history} />
                <div className='details'>
                    {selectedEvent.name}
                </div>
                <div className='football-live-list'>
                    <LiveEventsList history={this.props.history} />
                </div>
            </div>
        );
    }
}

EventDetails.propTypes = {
    getEvent: PropTypes.func
};

const mapStateToProps = state => {
    return {
        selectedEvent: state.appData.get('selectedEvent').toJS()
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getEvent: url => dispatch(getEvent(url))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventDetails);
