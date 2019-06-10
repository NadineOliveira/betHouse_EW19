import React from "react";
import { Route } from "react-router-dom";

import "./app.scss";

import { NavigationBar } from "./components/navigation-bar/navigation-bar.component";
import { Homepage } from "./pages/home.page";
import { LandingPage } from "./pages/landing.page";
import { BetPocketComponent } from "./components/bet-pocket/bet-pocket.component";
import { DataStore } from "./core/data-store";

class App extends React.PureComponent {
    state = {
        countries: [],
        bets: []
    };

    updateState = async () => {
        console.log("Updating data in App Component");
        const store = await DataStore.getInstance();
        this.setState({ countries: store.getCountries() });
        console.log("Data updated in App Component");
    };

    componentDidMount = async () => {
        DataStore.register(this.updateState);
        await this.updateState();
    };

    addBet = runnerId => {
        console.log("Added ", runnerId);
        // this.setState(prevBets => ({ bets: [...prevBets, runnerId] }));
    };

    render() {
        const { countries } = this.state;

        return (
            <div>
                <header className="header-container">
                    <div className="navigation-container">
                        <NavigationBar countries={countries} />
                        <BetPocketComponent />
                    </div>
                </header>
                <main className="main-container">
                    <Route path="/" exact component={props => <Homepage {...props} onAddBet={this.addBet} />} />
                    <Route
                        exact
                        path="/countries/:country"
                        component={props => <LandingPage {...props} onAddBet={this.addBet} />}
                    />
                    <Route
                        path="/countries/:country/events"
                        exact
                        component={props => <LandingPage {...props} onAddBet={this.addBet} />}
                    />
                </main>
            </div>
        );
    }
}

export default App;
