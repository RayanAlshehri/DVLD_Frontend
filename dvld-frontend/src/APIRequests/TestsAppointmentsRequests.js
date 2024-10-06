import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:61362/api/test-appointments",
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAppointment = (appointmentId) => {
    return api.get(`/${appointmentId}`)
}

export const getLastAppointment = (localLicenseApplicationId, testType) => {
    return api.get(`/${localLicenseApplicationId}/${testType}`)
}

export const addNewAppointment = (appointment) => {
    return api.post("", appointment);
}

export const bookRetake = (appointment) => {
    return api.post("/book-retake", appointment);
}