class CompetitionModel {
    constructor(id, name, country, events = []) {
        this._id = id;
        this._name = name;
        this._country = country;
        this._events = events;

        Object.freeze(this);
    }

    setEvents(events) {
        return new CompetitionModel(
            this.getId(),
            this.getName(),
            this.getCountry(),
            events
        );
    }

    getId() {
        return this._id;
    }

    getName() {
        return this._name;
    }

    getCountry() {
        return this._country;
    }

    getEvents() {
        return this._events;
    }

    toObject() {
        return Object.assign(
            {},
            {
                id: this.getId(),
                name: this.getName(),
                country: this.getCountry().toObject(),
                events: this.getEvents().map(event => event.toObject())
            }
        );
    }
}

export { CompetitionModel };
