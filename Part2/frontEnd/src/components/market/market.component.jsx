import React from "react";

import './market.component.scss';

const MarketComponent = props => {
    const { name, children } = props;

    return (
        <div className="market">
            <div className="market-name">
                <label>{name}</label>
            </div>
            <div className="market-runners">
                {children}
            </div>
        </div>
    );
};

export { MarketComponent };
