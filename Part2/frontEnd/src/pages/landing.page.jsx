import React from "react";

import "./landing.page.scss";

import { MarketsComponent } from "../components/market/markets.component";
import { MarketTypesComponent } from "../components/market/market-types.component";
import { MarketComponent } from "../components/market/market.component";
import { CompetitionComponent } from "../components/competition/competition.component";
import { BetButtonComponent } from "../components/bet-button/bet-button.component";

import { DataStore } from "../core/data-store";

class LandingPage extends React.PureComponent {
    state = {
        competitions: []
    };

    componentDidMount = async () => {
        const instance = await DataStore.getInstance();

        this.setState({
            competitions: instance.getCompetitions()
        });
    };

    render() {
        const {
            onAddBet,
            match: { params }
        } = this.props;
        const { competitions } = this.state;

        return competitions
            .filter(
                competition =>
                    competition.getCountry().getId() === params.country
            )
            .map(competition => {
                const markets = competition
                    .getEvents()
                    .reduce(
                        (acc, event) => [...acc, ...event.getMarkets()],
                        []
                    );

                return (
                    <CompetitionComponent
                        key={competition.getId()}
                        name={competition.getName()}
                    >
                        <MarketsComponent>
                            <MarketTypesComponent
                                types={
                                    (markets[0] &&
                                        markets[0]
                                            .getRunners()
                                            .map(runner => runner.getType())) ||
                                    []
                                }
                            />
                            {markets.map(market => (
                                <MarketComponent
                                    key={market.getId()}
                                    name={market.getName()}
                                >
                                    {market.getRunners().map(runner => (
                                        <BetButtonComponent
                                            onClick={onAddBet}
                                            key={runner.getId()}
                                            id={runner.getId()}
                                            odd={runner.getOdds()}
                                        />
                                    ))}
                                </MarketComponent>
                            ))}
                        </MarketsComponent>
                    </CompetitionComponent>
                );
            });
    }
}

export { LandingPage };
