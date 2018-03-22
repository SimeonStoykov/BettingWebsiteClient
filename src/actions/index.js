export const fetchEventsLoading = () => ({
    type: 'FETCH_EVENTS_LOADING'
});

export const fetchEventsSuccess = response => ({
    type: 'FETCH_EVENTS_SUCCESS',
    events: response.events
});

export const fetchEventsError = error => ({
    type: 'FETCH_EVENTS_ERROR',
    error
});

export const fetchEvents = url => {
    return dispatch => {
        dispatch(fetchEventsLoading());

        fetch(url)
            .then(response => response.json())
            .then(jsonResponse => dispatch(fetchEventsSuccess(jsonResponse)))
            .catch(error => dispatch(fetchEventsError(error)));
    };
}

export const openCloseCompetition = competitionId => ({
    type: 'OPEN_CLOSE_COMPETITION',
    competitionId
});
