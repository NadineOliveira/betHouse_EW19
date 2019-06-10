const EVENT_STATUS = {
    OPEN: "OPEN",
    CLOSED: "CLOSED"
};

class EventModel {
    constructor(id, name, status, startTime, competition, markets = []) {
        this._id = id;
        this._name = name;
        this._status = status;
        this._startTime = new Date(startTime);
        this._competition = competition;
        this._markets = markets;

        Object.freeze(this);
    }

    setMarkets(markets) {
        return new EventModel(
            this.getId(),
            this.getName(),
            this.getStatus(),
            this.getStartTime(),
            this.getCompetition(),
            markets
        );
    }

    getId() {
        return this._id;
    }

    getName() {
        return this._name;
    }

    getStatus() {
        return this._status;
    }

    getStartTime() {
        return this._startTime;
    }

    getCompetition() {
        return this._competition;
    }

    getMarkets() {
        return [...this._markets];
    }

    toObject() {
        return Object.assign(
            {},
            {
                id: this.getId(),
                name: this.getName(),
                status: this.getStatus(),
                startTime: this.getStartTime().toISOString(),
                competition: this.getCompetition().toObject(),
                markets: this.getMarkets().map(market => market.toObject())
            }
        );
    }
}

export { EventModel, EVENT_STATUS };
