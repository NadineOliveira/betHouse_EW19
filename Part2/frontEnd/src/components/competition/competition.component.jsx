import React from "react";

import './competition.component.scss';

const CompetitionComponent = props => {
    const { name, children } = props;

    return (
        <div className="competition">
            <div className="competition__name">{name}</div>
            {children}
        </div>
    );
};

export { CompetitionComponent };
