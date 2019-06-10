import React from "react";

const BetPocketBetComponent = props => {
    const { name, quantity, price, onClick } = props;
    return (
        <li className="bet-pocket-bet">
            <label className="bet-pocket-bet__name">{name}</label>
            <label className="bet-pocket-bet__quantity">{quantity}</label>
            <label className="bet-pocket-bet__price">€ {price}</label>
            <label className="bet-pocket-bet__delete" onClick={onClick}>
                x
            </label>
        </li>
    );
};

export { BetPocketBetComponent };
