import React from "react";

import "./market-types.component.scss";

const MarketTypesComponent = props => {
    const { types } = props;
    return (
        <div className="market-runner__types">
            {types.map((type, index) => <label key={index} className="market-runner__type">{type}</label>)}
        </div>
    );
};

export { MarketTypesComponent };
