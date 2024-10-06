import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:61362/api/taken-tests",
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getTestByAppointmentID = (appointmentId) => {
    return api.get(`/by-appointment-id/${appointmentId}`);
}

export const addNewTest = (test) => {
    return api.post("", test);
}
