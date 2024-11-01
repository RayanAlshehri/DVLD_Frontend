import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:61362/api/licenses",
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getLicenseByLicenseId = (licenseId) => {
    return api.get(`/by-license-id/${licenseId}`);
}

export const getLicenseByApplicationId = (applicationId) => {
    return api.get(`/by-application-id/${applicationId}`);
}

export const renewLicense = (oldLicenseId, createdByUserId) => {
    return api.post(`/renew/${oldLicenseId}/${createdByUserId}`);
}
