import { fromJS } from 'immutable';

const initialState = fromJS({
    competitions: [],
    eventsMarkets: {},
    eventsAreLoading: false,
    eventsLoadingError: null,
    priceRepresentation: 'fractions',
    selectedEvent: {}
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

            let competitions = [];

            for (let competitionId in groupedEvents) {
                let competitionName = groupedEvents[competitionId].competitionName === 'Football Live' ? 'Other' : groupedEvents[competitionId].competitionName;

                competitions.push({
                    id: competitionId,
                    name: competitionName,
                    isOpened: false,
                    events: groupedEvents[competitionId].events
                });
            }

            return state
                .set('eventsAreLoading', initialState.get('eventsAreLoading'))
                .set('eventsMarkets', fromJS(action.markets))
                .set('competitions', fromJS(competitions));
        case 'FETCH_EVENTS_ERROR':
            return state
                .set('eventsAreLoading', initialState.get('eventsAreLoading'))
                .set('eventsLoadingError', 'Error loading events data');
        case 'OPEN_CLOSE_COMPETITION':
            let oldCompetitions = state.get('competitions').toJS();
            let newCompetitions = oldCompetitions.map(rec => {
                if (rec.id === action.competitionId) {
                    rec.isOpened = !rec.isOpened;
                    return rec;
                }
                return rec;
            });

            return state.set('competitions', fromJS(newCompetitions));
        case 'GET_MARKET_SUCCESS':
            let { market, outcomes } = action.response;
            let eventId = market.eventId.toString();

            let eventMarkets = state.getIn(['eventsMarkets', eventId]).toJS();
            let existingMarketIndex = eventMarkets.map(e => e.marketId).indexOf(market.marketId);

            if (existingMarketIndex > -1) {
                let newMarket = { ...eventMarkets[existingMarketIndex] };
                newMarket.outcomes = outcomes[market.marketId];
                newMarket.isVisible = true;
                return state.setIn(['eventsMarkets', eventId, existingMarketIndex], newMarket);
            }

            return state;
        case 'SHOW_HIDE_PRIMARY_MARKET':
            let currEventId = action.market.eventId.toString();
            let searchedEventMarkets = state.get('eventsMarkets').toJS()[currEventId];
            let searchedMarketIndex = searchedEventMarkets.map(e => e.marketId).indexOf(action.market.marketId);

            if (searchedMarketIndex > -1) {
                let newMarket = { ...searchedEventMarkets[searchedMarketIndex] };
                newMarket.isVisible = !newMarket.isVisible;

                return state.setIn(['eventsMarkets', currEventId, searchedMarketIndex], newMarket);
            }

            return state;
        case 'CHANGE_PRICE_REPRESENTATION':
            return state.set('priceRepresentation', action.representation);
        case 'GET_EVENT_SUCCESS':
            console.log(action.data);
            return state.set('selectedEvent', fromJS(action.data.event));
        default:
            return state;
    }
}
