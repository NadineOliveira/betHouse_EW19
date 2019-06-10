import React from "react";

const BetPocketBetsComponent = props => {
    const { children } = props;
    return (
        <ul className="bet-pocket-bets">
            <li className="bet-pocket-bet">
                <label className="bet-pocket-bet__name" />
                <label className="bet-pocket-bet__quantity">Quantity</label>
                <label className="bet-pocket-bet__price">Price</label>
                <label className="bet-pocket-bet__delete" />
            </li>
            {children}
        </ul>
    );
};

export { BetPocketBetsComponent };
