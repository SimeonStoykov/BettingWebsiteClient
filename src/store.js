import { createStore, combineReducers, applyMiddleware } from 'redux';
import dataReducer from './dataReducer';
import thunk from 'redux-thunk';

const reducer = combineReducers({
    dataReducer
});

const store = createStore(
 reducer,
 applyMiddleware(thunk)
);

export default store;
