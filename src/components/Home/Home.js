import React from 'react';
import Header from '../Header/Header.js';
import LiveEventsList from '../LiveEventsList/LiveEventsList.js';
import './Home.css';

const Home = ({ history }) => {
  return (
    <div>
      <Header history={history} className='home-header-box' />
      <LiveEventsList history={history} />
    </div>
  );
}

export default Home;
