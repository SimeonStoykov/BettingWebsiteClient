import { fromJS } from 'immutable';

const initialState = fromJS({
    competitions: [],
    eventsMarkets: {},
    eventsAreLoading: false,
    eventsLoadingError: null,
    priceRepresentation: 'fractions',
    selectedEvent: {
        markets: []
    }
});

export default (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_EVENTS_LOADING': {
            return state
                .set('eventsAreLoading', true)
                .set('eventsLoadingError', initialState.get('eventsLoadingError'));
        }
        case 'FETCH_EVENTS_SUCCESS': {
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
        }
        case 'FETCH_EVENTS_ERROR': {
            return state
                .set('eventsAreLoading', initialState.get('eventsAreLoading'))
                .set('eventsLoadingError', 'Error loading events data');
        }
        case 'OPEN_CLOSE_COMPETITION': {
            let competitions = state.get('competitions').toJS();
            for (let i = 0; i < competitions.length; i++) {
                let currCompetition = competitions[i];
                if (currCompetition.id === action.competitionId) {
                    return state.setIn(['competitions', i, 'isOpened'], !currCompetition.isOpened);
                }
            }
            return state;
        }
        case 'GET_MARKET_SUCCESS': {
            let { market, outcomes } = action.response;
            let eventId = market.eventId.toString();

            if (action.caller === 'footballLiveList') {
                let eventMarkets = state.getIn(['eventsMarkets', eventId]).toJS();
                let existingMarketIndex = eventMarkets.map(e => e.marketId).indexOf(market.marketId);

                if (existingMarketIndex > -1) {
                    let newMarket = { ...eventMarkets[existingMarketIndex] };
                    newMarket.outcomes = outcomes[market.marketId];
                    newMarket.isVisible = true;
                    return state.setIn(['eventsMarkets', eventId, existingMarketIndex], newMarket);
                }
            } else if (action.caller === 'selectedEvent') {
                let selectedEvent = state.get('selectedEvent').toJS();

                if (selectedEvent && selectedEvent.markets && market && outcomes && outcomes[market.marketId]) {
                    for (let i = 0; i < selectedEvent.markets.length; i++) {
                        let currMarket = selectedEvent.markets[i];

                        if (currMarket.marketId === market.marketId) {
                            return state
                                .setIn(['selectedEvent', 'markets', i, 'outcomes'], fromJS(outcomes[market.marketId]))
                                .setIn(['selectedEvent', 'markets', i, 'isOpened'], true);
                        }
                    }
                }
            }

            return state;
        }
        case 'SHOW_HIDE_PRIMARY_MARKET': {
            let eventId = action.market.eventId.toString();
            let searchedEventMarkets = state.get('eventsMarkets').toJS()[eventId];
            let searchedMarketIndex = searchedEventMarkets.map(e => e.marketId).indexOf(action.market.marketId);

            if (searchedMarketIndex > -1) {
                let newMarket = { ...searchedEventMarkets[searchedMarketIndex] };
                newMarket.isVisible = !newMarket.isVisible;

                return state.setIn(['eventsMarkets', eventId, searchedMarketIndex], newMarket);
            }

            return state;
        }
        case 'CHANGE_PRICE_REPRESENTATION': {
            return state.set('priceRepresentation', action.representation);
        }
        case 'GET_EVENT_SUCCESS': {
            let receivedData = action.data || {};
            let eventToSend = receivedData.event || {};
            eventToSend.markets = [];

            if (eventToSend.eventId && receivedData.markets && receivedData.markets[eventToSend.eventId]) {
                eventToSend.markets = receivedData.markets[eventToSend.eventId].filter(rec => rec.status.displayable);
            }

            if (receivedData.outcomes) {
                eventToSend.markets = eventToSend.markets.map((m, index) => {
                    if (receivedData.outcomes[m.marketId]) {
                        m.outcomes = receivedData.outcomes[m.marketId];
                        index < 10 && (m.isOpened = true);
                    }
                    return m;
                });
            }

            return state.set('selectedEvent', fromJS(eventToSend));
        }
        case 'OPEN_CLOSE_MARKET': {
            let currSelectedEvent = state.get('selectedEvent').toJS();
            if (currSelectedEvent.markets) {
                for (let i = 0; i < currSelectedEvent.markets.length; i++) {
                    let currMarket = currSelectedEvent.markets[i];
                    if (currMarket.marketId === action.marketId) {
                        return state.setIn(['selectedEvent', 'markets', i, 'isOpened'], !currMarket.isOpened);
                    }
                }
            }
            return state;
        }
        case 'CLEAR_SELECTED_EVENT': {
            return state.set('selectedEvent', initialState.get('selectedEvent'));
        }
        case 'UPDATE_OUTCOME_DATA': {
            let data = action.data;
            let updatedValue = data.updatedValue;

            if (data.type === 'primaryMarket') {
                let currPrimaryMarket = state.getIn(['eventsMarkets', data.eventId, data.indexOfMarket]);

                if (currPrimaryMarket && currPrimaryMarket.outcomes && currPrimaryMarket.outcomes[data.indexOfOutcome]) {
                    let newOutcomes = currPrimaryMarket.outcomes.map(rec => ({ ...rec }));
                    newOutcomes[data.indexOfOutcome][updatedValue] = data[updatedValue];
                    let newPrimaryMarket = { ...currPrimaryMarket, outcomes: newOutcomes };

                    console.log(currPrimaryMarket.outcomes[data.indexOfOutcome]);
                    console.log(newPrimaryMarket.outcomes[data.indexOfOutcome]);

                    return state.setIn(['eventsMarkets', data.eventId, data.indexOfMarket], newPrimaryMarket);
                }
            } else if (data.type === 'selectedEvent') {
                let currentOutcome = state.getIn(['selectedEvent', 'markets', data.indexOfMarket, 'outcomes', data.indexOfOutcome]).toJS();
                let newOutcome = { ...currentOutcome, [updatedValue]: data[updatedValue] };

                console.log(currentOutcome);
                console.log(newOutcome);

                return state.setIn(['selectedEvent', 'markets', data.indexOfMarket, 'outcomes', data.indexOfOutcome], fromJS(newOutcome));
            }

            return state;
        }
        default:
            return state;
    }
}
