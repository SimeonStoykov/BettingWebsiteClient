import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home.js';
import EventDetails from './components/EventDetails/EventDetails.js';

const wsUrl = 'ws://192.168.99.100:8889';
let ws = new WebSocket(wsUrl);

export default () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/' render={routeProps => <Home ws={ws} {...routeProps} />} />
                <Route path='/event/:id' render={routeProps => <EventDetails ws={ws} {...routeProps} />} />
            </Switch>
        </BrowserRouter>
    );
};
