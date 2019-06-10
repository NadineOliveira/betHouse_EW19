class CountryModel {
    constructor(id, name, locale, language, flag, competitions = []) {
        this._id = id;
        this._name = name;
        this._locale = locale;
        this._language = language;
        this._flag = flag;
        this._competitions = competitions;

        Object.freeze(this);
    }

    setCompetitions(competitions) {
        return new CountryModel(
            this.getId(),
            this.getName(),
            this.getLocale(),
            this.getLanguage(),
            this.getFlag(),
            competitions
        );
    }

    getId() {
        return this._id;
    }

    getName() {
        return this._name;
    }

    getLocale() {
        return this._locale;
    }

    getLanguage() {
        return this._language;
    }

    getFlag() {
        return this._flag;
    }

    getCompetitions() {
        return [...this._competitions];
    }

    toObject() {
        return Object.assign(
            {},
            {
                id: this.getId(),
                name: this.getName(),
                locale: this.getLocale(),
                language: this.getLanguage(),
                flag: this.getFlag(),
                competitions: this.getCompetitions()
            }
        );
    }
}

export { CountryModel };
