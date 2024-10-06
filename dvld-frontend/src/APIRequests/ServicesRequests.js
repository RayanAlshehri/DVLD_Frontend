import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:61362/api/services",
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getService = (serviceId) => {
    return api.get(`/${serviceId}`);
}