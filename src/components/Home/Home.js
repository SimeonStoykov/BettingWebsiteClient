import React from 'react';
import Header from '../Header/Header.js';
import LiveEventsList from '../LiveEventsList/LiveEventsList.js';
import './Home.css';

const Home = ({ history, ws }) => {
  return (
    <div>
      <Header history={history} className='home-header-box' />
      <LiveEventsList history={history} ws={ws} />
    </div>
  );
}

export default Home;
