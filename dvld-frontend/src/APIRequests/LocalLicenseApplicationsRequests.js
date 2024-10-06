import axios from "axios";

const api = axios.create ({
    baseURL: "https://localhost:61362/api/local-license-applications",
    headers: {
        'Content-Type': 'application/json',
    },
})

export const getAllLocalLicenseApplications = () => {
    return api.get();
}

export const getApplicationByLocalLicesneApplicationId = (applicationId) => {
    return api.get(`/by-local-license-application-id/${applicationId}`);
}
export const getApplicationByApplicationId = (applicationId) => {
    return api.get(`/by-application-id/${applicationId}`);
}

export const addNewApplication = (application) => {
    return api.post("/create-application", application);
}

export const issueLicense = (licenseInfo) => {
    return api.post("/issue-license", licenseInfo);
}