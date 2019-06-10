import React from "react";

const BetPocketButtonComponent = (props) => {
    const {quantity, onClick} = props
    return (
        <div className="bet-pocket-button" onClick={onClick}>
            <div className="bet-pocket-button__counter">{quantity}</div>
            <label className="bet-pocket-button__label">Pocket</label>
        </div>
    );
};

export { BetPocketButtonComponent };
