class RunnerModel {
    constructor(id, type, odds) {
        this._id = id;
        this._type = type;
        this._odds = odds;

        Object.freeze(this);
    }

    getId() {
        return this._id;
    }

    getType() {
        return this._type;
    }

    getOdds() {
        return this._odds;
    }

    toObject() {
        return Object.assign(
            {},
            {
                id: this.getId(),
                type: this.getType(),
                odds: this.getOdds()
            }
        );
    }
}

export { RunnerModel };
