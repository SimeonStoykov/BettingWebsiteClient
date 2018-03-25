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

export const getMarketSuccess = (response, caller) => ({
    type: 'GET_MARKET_SUCCESS',
    response,
    caller
});

export const getMarket = (url, caller) => {
    return dispatch => {
        // dispatch(fetchEventsLoading());

        fetch(url)
            .then(response => response.json())
            .then(jsonResponse => dispatch(getMarketSuccess(jsonResponse, caller)))
        // .catch(error => dispatch(fetchEventsError()));
    };
}

export const showHidePrimaryMarket = market => ({
    type: 'SHOW_HIDE_PRIMARY_MARKET',
    market
});

export const changePriceRepr = representation => ({
    type: 'CHANGE_PRICE_REPRESENTATION',
    representation
});

export const getEventSuccess = response => ({
    type: 'GET_EVENT_SUCCESS',
    data: response
});

export const getEvent = url => {
    return dispatch => {
        // dispatch(getEventLoading());

        fetch(url)
            .then(response => response.json())
            .then(jsonResponse => dispatch(getEventSuccess(jsonResponse)))
        // .catch(error => dispatch(getEventError()));
    };
}

export const openCloseMarket = marketId => ({
    type: 'OPEN_CLOSE_MARKET',
    marketId
});
