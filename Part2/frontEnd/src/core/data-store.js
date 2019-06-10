import { getCountries } from "./services/countries.service";
import { getCompetitions } from "./services/competitions.service";
import { getEvents } from "./services/events.service";
import { getMarkets } from "./services/markets.service";

let instance;
let callbacks = [];

class DataStore {
    constructor(events, markets, countries, competitions) {
        this._events = events;
        this._markets = markets;
        this._countries = countries;
        this._competitions = competitions;

        Object.freeze(this);
    }

    static addCompetitionsToCountries(countries, competitions) {
        return countries.map(country => {
            const countryCompetitions = competitions.filter(
                competition =>
                    competition.getCountry().getId() === country.getId()
            );

            return country.setCompetitions(countryCompetitions);
        });
    }

    static addEventsToCompetitions(competitions, events) {
        return competitions.map(competition => {
            const competitionEvents = events.filter(
                event => event.getCompetition().getId() === competition.getId()
            );

            return competition.setEvents(competitionEvents);
        });
    }

    static addMarketsToEvents(events, markets) {
        return events.map(event => {
            const eventMarkets = markets.filter(
                market => market.getEvent().getId() === event.getId()
            );
            return event.setMarkets(eventMarkets);
        });
    }

    static async load() {
        const tmpCountries = await getCountries();
        const tmpCompetitions = await getCompetitions(tmpCountries);
        const tmpEvents = await getEvents(tmpCompetitions);
        const markets = await getMarkets(tmpEvents);

        const events = DataStore.addMarketsToEvents(tmpEvents, markets);

        const competitions = DataStore.addEventsToCompetitions(
            tmpCompetitions,
            events
        );
        const countries = DataStore.addCompetitionsToCountries(
            tmpCountries,
            competitions
        );
        
        return new DataStore(events, markets, countries, competitions);
    }

    static async register(callback) {
        callbacks.push(callback);
    }

    static async update() {
        callbacks.forEach((callback) => callback());
    }

    static async destroy() {
        instance = undefined;
    }

    static async getInstance() {
        if (!instance) {
            instance = DataStore.load();
        }

        return instance;
    }

    getEvents() {
        return [...this._events];
    }

    getMarkets() {
        return [...this._markets];
    }

    getCountries() {
        return [...this._countries];
    }

    getCompetitions() {
        return [...this._competitions];
    }
}

window.triggerUpdate = DataStore.update;

export { DataStore };
