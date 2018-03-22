export const fetchEventsLoading = () => ({
    type: 'FETCH_EVENTS_LOADING'
});

export const fetchEventsSuccess = response => ({
    type: 'FETCH_EVENTS_SUCCESS',
    events: response.events,
    markets: response.markets
});

export const fetchEventsError = () => ({
    type: 'FETCH_EVENTS_ERROR'
});

export const fetchEvents = url => {
    return dispatch => {
        dispatch(fetchEventsLoading());

        fetch(url)
            .then(response => response.json())
            .then(jsonResponse => dispatch(fetchEventsSuccess(jsonResponse)))
            .catch(error => dispatch(fetchEventsError()));
    };
}

export const openCloseCompetition = competitionId => ({
    type: 'OPEN_CLOSE_COMPETITION',
    competitionId
});

export const getMarketSuccess = response => ({
    type: 'GET_MARKET_SUCCESS',
    response
});

export const getMarket = url => {
    return dispatch => {
        // dispatch(fetchEventsLoading());

        fetch(url)
            .then(response => response.json())
            .then(jsonResponse => dispatch(getMarketSuccess(jsonResponse)))
            // .catch(error => dispatch(fetchEventsError()));
    };
}
