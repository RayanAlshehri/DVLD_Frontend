import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:61362/api/services",
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAllServices = () => {
    return api.get();
}

export const getService = (serviceId) => {
    return api.get(`/${serviceId}`);
}

export const updateService = (serviceId ,service) => {
    return api.put(`/${serviceId}`, service);
}