const MARKET_STATUS = {
    CLOSED: "CLOSED",
    SUSPENDED: "SUSPENDED"
};

const MARKET_TYPES = {
    MATCH_ODDS: "MATCH_ODDS"
};

class MarketModel {
    constructor(id, name, event, type, status, runners = []) {
        this._id = id;
        this._name = name;
        this._event = event;
        this._type = type;
        this._status = status;
        this._runners = runners;

        Object.freeze(this);
    }

    getId() {
        return this._id;
    }

    getName() {
        return this._name;
    }

    getEvent() {
        return this._event;
    }

    getStatus() {
        return this._status;
    }

    getType() {
        return this._type;
    }

    getRunners() {
        return [...this._runners];
    }

    toObject() {
        return Object.assign(
            {},
            {
                id: this.getId(),
                name: this.getName(),
                event: this.getEvent().toObject(),
                type: this.getStatus(),
                status: this.getType(),
                runners: this.getRunners().map(runner => runner.toObject())
            }
        );
    }
}

export { MarketModel, MARKET_STATUS, MARKET_TYPES };
