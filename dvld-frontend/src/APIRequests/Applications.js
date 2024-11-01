import axios from "axios";

const api = axios.create ({
    baseURL: "https://localhost:61362/api/applications",
    headers: {
        'Content-Type': 'application/json',
    },
})

export const getTotalNumberOfLocalLicenseApplications = () => {
    return api.get();
}

export const updateApplicationStatus = (applicationId, status) => {
    return api.patch(`/${applicationId}/${status}`);
}