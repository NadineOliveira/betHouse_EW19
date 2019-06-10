import { get } from "./firebase.service";
import { CompetitionModel } from "../models/competition.model";

const getCompetitions = async countries => {
    const rawDataCompetitions = await get("competitions");

    return rawDataCompetitions.map(({ id, name, countryId }) => {
        const country = countries.find(
            country => country.getId() === countryId
        );
        return new CompetitionModel(id, name, country);
    });
};

export { getCompetitions };
