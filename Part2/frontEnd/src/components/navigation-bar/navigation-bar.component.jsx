import React from "react";
import { NavLink } from "react-router-dom";
import "./navigation-bar.component.scss";

const NavigationBar = props => {
    const { countries } = props;

    return (
        <nav className="navigation-bar">
            <NavLink className="navigation-item" exact to={`/`}>
                All Countries
            </NavLink>
            {countries.map((country) => (
                <NavLink
                    key={country.getId()}
                    className="navigation-item"
                    to={`/countries/${country.getId()}`}
                >
                    {country.getName()}
                </NavLink>
            ))}
        </nav>
    );
};

export { NavigationBar };
