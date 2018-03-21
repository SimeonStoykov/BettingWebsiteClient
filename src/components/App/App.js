import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { connect } from 'react-redux';

import {
  fetchEvents
} from '../../actions';

const eventsUrl = 'http://192.168.99.100:8888/football/live';

class App extends Component {
  componentDidMount() {
    this.props.fetchEvents(eventsUrl);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Betting Website</h1>
        </header>
        <h2>Football Live</h2>
        {this.props.eventsAreLoading ? 'Loading...' : ''}
        {this.props.eventsLoadingError}
        {
          this.props.events.map(e => {
            return <div key={e.eventId}>{e.name}</div>;
          })
        }
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
    fetchEvents: url => dispatch(fetchEvents(url))
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
