import { createStore, combineReducers, applyMiddleware } from 'redux';
import appReducer from './reducers/appReducer';
import thunk from 'redux-thunk';

const reducers = combineReducers({
    appData: appReducer
});

const store = createStore(
    reducers,
    applyMiddleware(thunk)
);

export default store;
