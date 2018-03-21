import { fromJS } from 'immutable';

const initialState = fromJS({
    events: [],
    eventsAreLoading: false,
    eventsLoadingError: null
});

export default (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_EVENTS_LOADING':
            return state.set('eventsAreLoading', true);
        case 'FETCH_EVENTS_SUCCESS':
            return state
                    .set('eventsAreLoading', initialState.get('eventsAreLoading'))
                    .set('events', fromJS(action.events || []));
        case 'FETCH_EVENTS_ERROR':
            let error = action.error && action.error.message ? action.error.message : 'Error fetching events';
            return state
                    .set('eventsAreLoading', initialState.get('eventsAreLoading'))
                    .set('eventsLoadingError', error);
        default:
            return state;
    }
}
