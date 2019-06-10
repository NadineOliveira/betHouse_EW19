import React from "react";

const MarketsComponent = props => {
    const { children } = props;
    return (
        <div className="markets__container">
            {children}
        </div>
    );
};

export { MarketsComponent };
