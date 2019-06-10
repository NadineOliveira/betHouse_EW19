import { get } from "./firebase.service";
import { EventModel } from "../models/event.model";

const getEvents = async (competitions) => {
    const rawDataEvents = await get("events");

    return rawDataEvents.map(({ id, name, status, startTime, competitionId }) => {
        const competition = competitions.find(
            competition => competition.getId() === competitionId
        );
        return new EventModel(id, name, status, startTime, competition);
    });
};

export { getEvents };
