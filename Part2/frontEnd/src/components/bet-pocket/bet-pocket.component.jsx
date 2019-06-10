import React, { useState } from "react";

import { BetPocketButtonComponent } from "./bet-pocket-button.component";

import "./bet-pocket.component.scss";
import { BetPocketBetsComponent } from "./bet-pocket-bets.component";
import { BetPocketBetComponent } from "./bet-pocket-bet.component";

const noop = () => void 0;

const BetPocketComponent = () => {
    const [show, toggle] = useState(false);

    return (
        <div className="bet-pocket">
            <BetPocketButtonComponent quantity="0" onClick={() => toggle(!show)} />
            {show && (
                <BetPocketBetsComponent>
                    <BetPocketBetComponent
                        name="FC Porto - SC Braga"
                        quantity="2"
                        price="3.50"
                        onClick={noop}
                    />
                    <BetPocketBetComponent
                        name="FC Porto - SC Braga"
                        quantity="2"
                        price="3.50"
                        onClick={noop}
                    />
                    <BetPocketBetComponent
                        name="FC Porto - SC Braga"
                        quantity="2"
                        price="3.50"
                        onClick={noop}
                    />
                </BetPocketBetsComponent>
            )}
        </div>
    );
};

export { BetPocketComponent };
