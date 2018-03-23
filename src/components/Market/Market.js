import React from 'react';
import './Market.css';

const Market = ({ data, priceRepresentation }) => {
    if (data && data.outcomes) {
        return (
            <div className='primary-market-outcomes-box'>
                {
                    data.outcomes.map(o => {
                        let price = null;
                        if (priceRepresentation === 'fractions') {
                            price = `${o.price.num}/${o.price.den}`;
                        } else if (priceRepresentation === 'decimals') {
                            price = parseFloat(o.price.decimal).toFixed(2);
                        }
    
                        return (
                            <div key={o.outcomeId} className='outcome-box'>
                                <strong>{o.name}</strong> <span className='price'>{price}</span>
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    return null;
};

export default Market;
