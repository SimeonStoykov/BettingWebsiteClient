import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Header.css';

import {
    changePriceRepr
} from '../../actions';

class Header extends Component {
    constructor(props) {
        super(props);
        this.loadHomePage = this.loadHomePage.bind(this);
    }
    loadHomePage() {
        this.props.history && this.props.history.push('/');
    }
    render() {
        let { priceRepresentation, changePriceRepr } = this.props;
        return (
            <header className="app-header">
                <h1 className="header-title" title='Go to home page' onClick={this.loadHomePage}> Betting Website</h1>
                <div className='odds-box'>
                    <h3 className='odds-title'>Odds</h3>
                    <button className={priceRepresentation === 'fractions' ? 'odds-button odds-button-selected' : 'odds-button'} onClick={() => changePriceRepr('fractions')}>
                        Fractions
                    </button>
                    <button className={priceRepresentation === 'decimals' ? 'odds-button odds-button-selected' : 'odds-button'} onClick={() => changePriceRepr('decimals')}>
                        Decimals
                    </button>
                </div>
            </header>
        );
    }
};

Header.propTypes = {
    getEvent: PropTypes.func
};

const mapStateToProps = state => {
    return {
        priceRepresentation: state.appData.get('priceRepresentation')
    };
}

const mapDispatchToProps = dispatch => {
    return {
        changePriceRepr: representation => dispatch(changePriceRepr(representation))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
