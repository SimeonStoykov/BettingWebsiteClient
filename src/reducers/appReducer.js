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
            let groupByEventType = (data, key, name, secondKey, secondName) => {
                return data.reduce((groupedData, currEvent) => {
                    let groupId = currEvent[key];
                    let groupName = currEvent[name];
                    !groupId && (groupId = currEvent[secondKey]);
                    !groupName && (groupName = currEvent[secondName]);

                    (groupedData[groupId] = groupedData[groupId] || { competitionName: groupName, events: [] }).events.push(currEvent);

                    return groupedData;
                }, {});
            };

            let groupedEvents = groupByEventType(action.events, 'linkedEventTypeId', 'linkedEventTypeName', 'typeId', 'typeName');

            let events = [];

            for (let competitionId in groupedEvents) {
                let competitionName = groupedEvents[competitionId].competitionName === 'Football Live' ? 'Other' : groupedEvents[competitionId].competitionName;
                events.push({
                    competition: {
                        id: competitionId,
                        name: competitionName,
                        isOpened: false
                    },
                    eventsData: groupedEvents[competitionId].events
                });
            }

            return state
                .set('eventsAreLoading', initialState.get('eventsAreLoading'))
                .set('events', fromJS(events));
        case 'FETCH_EVENTS_ERROR':
            return state
                .set('eventsAreLoading', initialState.get('eventsAreLoading'))
                .set('eventsLoadingError', 'Error loading events data');
        case 'OPEN_CLOSE_COMPETITION':
            let oldEvents = state.get('events').toJS();
            let newEvents = oldEvents.map(rec => {
                if (rec.competition.id === action.competitionId) {
                    rec.competition.isOpened = !rec.competition.isOpened;
                    return rec;
                }
                return rec;
            });

            return state.set('events', fromJS(newEvents));
        default:
            return state;
    }
}
