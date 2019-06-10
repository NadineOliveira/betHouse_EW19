import { get } from "./firebase.service";
import { CountryModel } from "../models/country.model";

const buildCountryModel = ({ id, name, locale, language, flag }) =>
    new CountryModel(id, name, locale, language, flag);

const getCountries = async () => {
    const rawDataCountries = await get("countries");
    return rawDataCountries.map(buildCountryModel);
};

export { getCountries };
