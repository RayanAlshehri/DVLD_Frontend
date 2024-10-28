import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:61362/api/license-classes",
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAllLicenseClasses = () => {
    return api.get();
}

export const getLicenseClass = (LicenseClassId) => {
    return api.get(`/${LicenseClassId}`);
}

export const isAgeValidForClass = (age, licenseClassId) => {
    return api.get(`/${age}/${licenseClassId}/is-age-valid`);
}

export const updateLicenseClass = (licenseClassId ,licenseClass) => {
    return api.put(`/${licenseClassId}`, licenseClass);
}