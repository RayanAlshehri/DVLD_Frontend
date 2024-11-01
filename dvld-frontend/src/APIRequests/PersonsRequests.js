import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:61362/api/persons",

});

export const getAllPersons = () => {
    return api.get();
};

export const getPersonById = (id) => {
    return api.get(`/by-person-id/${id}`);
};

export const getPersonByNationalNumber = (nationalNumber) => {
    return api.get(`/by-national-number/${nationalNumber}`);
};

export const getTotalNumberOfPersons = () => {
    return api.get("/total-number-of-persons");
}


export const addNewPerson = (person) => {
    return api.post('', person);
};

export const updatePerson = (personId, personInfo) => {
    return api.put(`/${personId}`, personInfo);
};

export const deletePersonByNationalNumber = (nationalNumber) => {
    return api.delete(`/by-national-number/${nationalNumber}`);
};

export const doesPersonExistByNationalNumber = (nationalNumber) => {
    return api.get(`${nationalNumber}/does-exist`);
}

export const doesPersonHaveNewApplicationForLicenseClass = (personId, licenseClassId) => {
    return api.get(`${personId}/${licenseClassId}/has-new-application-for-license-class`);
}

export const doesPersonHaveLicenseForLicenseClass = (personId, licenseClassId) => {
    return api.get(`${personId}/${licenseClassId}/has-license-for-license-class`);
}