import React from 'react';
import './Market.css';

const Market = ({ data }) => {
    return (
        <div>
            <div className='market-name'>
                {data.name}
            </div>
        </div>
    );
};

export default Market;
