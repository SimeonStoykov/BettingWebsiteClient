import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LiveEventsList from '../LiveEventsList/LiveEventsList.js';
import './App.css';

import {
  fetchEvents,
  openCloseCompetition
} from '../../actions';

const eventsUrl = 'http://192.168.99.100:8888/football/live';

class App extends Component {
  componentDidMount() {
    this.props.fetchEvents(eventsUrl);
  }

  render() {
    let { events, eventsAreLoading, eventsLoadingError, openCloseCompetition } = this.props;

    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">Betting Website</h1>
        </header>
        <LiveEventsList events={events} eventsAreLoading={eventsAreLoading} eventsLoadingError={eventsLoadingError} openCloseCompetition={openCloseCompetition} />
      </div>
    );
  }
}

App.propTypes = {
  events: PropTypes.array,
  eventsAreLoading: PropTypes.bool,
  eventsLoadingError: PropTypes.string
};

const mapStateToProps = state => {
  return {
    events: state.appData.get('events').toJS(),
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
)(App);
