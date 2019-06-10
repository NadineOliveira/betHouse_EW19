import { get } from "./firebase.service";
import { MarketModel } from "../models/market.model";
import { RunnerModel } from "../models/runner.model";

const getMarkets = async (events) => {
    const rawDataMarkets = await get("markets");

    return rawDataMarkets.map(({ id, name, eventId, marketType, status, runners }) => {
        const event = events.find(event => event.getId() === eventId);
        const runnersList = runners.map(
            ({ selectionId, type, odds }) => new RunnerModel(selectionId, type, odds)
        );
        return new MarketModel(id, name, event, marketType, status, runnersList);
    });
};

export { getMarkets };
