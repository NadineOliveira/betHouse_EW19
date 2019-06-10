import React from "react";

import './bet-button.component.scss';

const BetButtonComponent = props => {
    const { id, odd, onClick } = props;
    
    return (
        <div className="bet__button" onClick={() => onClick(id)}>{odd}</div>
    );
};

export { BetButtonComponent };
