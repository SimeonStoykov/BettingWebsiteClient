import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home.js';
import EventDetails from './components/EventDetails/EventDetails.js';

export default () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Home} />} />
                <Route path='/event/:id' component={EventDetails} />
            </Switch>
        </BrowserRouter>
    );
};
