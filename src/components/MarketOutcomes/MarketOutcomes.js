import React from 'react';
import './MarketOutcomes.css';

const MarketOutcomes = ({ data, priceRepresentation }) => {
    if (data && data.outcomes && data.type) {
        switch (data.type) {
            case 'standard': {
                return (
                    <div className='standard-outcomes-box'>
                        {
                            data.outcomes.map(o => {
                                let outcomePrice = null;

                                if (!o.status.displayable) {
                                    outcomePrice = <div className='standard-outcome-price not-displayable'>-</div>;
                                } else if (o.status.suspended) {
                                    outcomePrice = <div className='standard-outcome-price suspended'>Susp</div>;
                                } else {
                                    let price = null;
                                    if (priceRepresentation === 'fractions') {
                                        price = `${o.price.num}/${o.price.den}`;
                                    } else if (priceRepresentation === 'decimals') {
                                        price = parseFloat(o.price.decimal).toFixed(2);
                                    }
                                    outcomePrice = <div className='price standard-outcome-price'>{price}</div>;
                                }

                                return (
                                    <div key={o.outcomeId} className='standard-outcome-box'>
                                        <div className='standard-outcome-name'>{o.name}</div>
                                        {outcomePrice}
                                    </div>
                                );
                            })
                        }
                    </div>
                );
            }
            case 'win-draw-win': {
                return (
                    <div className='win-draw-win-outcomes-box'>
                        {
                            data.outcomes.map(o => {
                                let outcomeData = null;
                                if (!o.status.displayable) {
                                    outcomeData = <div key={o.outcomeId} className='not-displayable'>-</div>;
                                } else if (o.status.suspended) {
                                    outcomeData = <div key={o.outcomeId} className='suspended'>Susp</div>;
                                } else {
                                    let price = null;
                                    if (priceRepresentation === 'fractions') {
                                        price = `${o.price.num}/${o.price.den}`;
                                    } else if (priceRepresentation === 'decimals') {
                                        price = parseFloat(o.price.decimal).toFixed(2);
                                    }
                                    outcomeData =
                                        <div key={o.outcomeId} className='win-draw-win-outcome-box'>
                                            <strong>{o.type === 'draw' ? 'Draw' : 'Win'}</strong> <span className='price'>{price}</span>
                                        </div>;
                                }

                                return outcomeData;
                            })
                        }
                    </div>
                );
            }
            case 'correct-score': {
                return (
                    <div>Correct score</div>
                );
            }
            default:
                return null;
        }
    }

    return null;
};

export default MarketOutcomes;
