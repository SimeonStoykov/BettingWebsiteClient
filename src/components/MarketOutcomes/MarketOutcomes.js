import React from 'react';
import './MarketOutcomes.css';

const MarketOutcomes = ({ data, priceRepresentation }) => {
    function getOutcomePrice(outcome) {
        let price = null;
        if (outcome.price) {
            priceRepresentation === 'fractions' && (price = `${outcome.price.num}/${outcome.price.den}`);
            priceRepresentation === 'decimals' && (price = parseFloat(outcome.price.decimal).toFixed(2));
        }

        return price;
    }

    function getCorrectScoreOutcomeData(currOutcome) {
        let currOutcomeData = <div className='correct-score-outcome-data'>-</div>;

        if (currOutcome && currOutcome.score && currOutcome.price && currOutcome.status && currOutcome.status.displayable) {
            if (currOutcome.status.suspended) {
                currOutcomeData = <div className='correct-score-outcome-data suspended'>Susp</div>;
            } else {
                currOutcomeData = <div className='correct-score-outcome-data correct-score-have-data'>
                    {currOutcome.score.home}-{currOutcome.score.away} <span className='price'>{getOutcomePrice(currOutcome)}</span>
                </div>;
            }
        }

        return currOutcomeData;
    }

    if (data && data.outcomes && data.type) {
        switch (data.type) {
            case 'standard': {
                return (
                    <div className='standard-outcomes-box'>
                        {
                            data.outcomes.map(o => {
                                let outcomePriceData = null;

                                if (!o.status.displayable) {
                                    outcomePriceData = <div className='standard-outcome-price not-displayable'>-</div>;
                                } else if (o.status.suspended) {
                                    outcomePriceData = <div className='standard-outcome-price suspended'>Susp</div>;
                                } else {
                                    outcomePriceData = <div className='price standard-outcome-price'>{getOutcomePrice(o)}</div>;
                                }

                                return (
                                    <div key={o.outcomeId} className='standard-outcome-box'>
                                        <div className='standard-outcome-name'>{o.name}</div>
                                        {outcomePriceData}
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
                                    outcomeData =
                                        <div key={o.outcomeId} className='win-draw-win-outcome-box'>
                                            <strong>{o.type === 'draw' ? 'Draw' : 'Win'}</strong> <span className='price'>{getOutcomePrice(o)}</span>
                                        </div>;
                                }

                                return outcomeData;
                            })
                        }
                    </div>
                );
            }
            case 'correct-score': {
                let homeOutcomes = data.outcomes.filter(o => o.type === 'home');
                let drawOutcomes = data.outcomes.filter(o => o.type === 'draw');
                let awayOutcomes = data.outcomes.filter(o => o.type === 'away');
                let maxCountOfOutcoumes = Math.max(homeOutcomes.length, drawOutcomes.length, awayOutcomes.length);
                let outcomesRows = [];

                for (let i = 0; i < maxCountOfOutcoumes; i++) {
                    outcomesRows.push(
                        <div key={i} className='correct-score-outcome-row'>
                            {getCorrectScoreOutcomeData(homeOutcomes[i])}
                            {getCorrectScoreOutcomeData(drawOutcomes[i])}
                            {getCorrectScoreOutcomeData(awayOutcomes[i])}
                        </div>
                    );
                }

                return (
                    <div className='correct-score-outcomes-box'>
                        <div className='correct-score-title-row'>
                            <div className='correct-score-title-row-home'>Home</div>
                            <div className='correct-score-title-row-draw'>Draw</div>
                            <div className='correct-score-title-row-away'>Away</div>
                        </div>
                        {outcomesRows}
                    </div>
                );
            }
            default:
                return null;
        }
    }

    return null;
};

export default MarketOutcomes;
