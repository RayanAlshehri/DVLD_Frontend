import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:61362/api/test-types",
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAllTestTypes = () => {
    return api.get();
}

export const getTestType = (testTypeId) => {
    return api.get(`/${testTypeId}`);
}

export const updateTestType = (testTypeId ,testType) => {
    return api.put(`/${testTypeId}`, testType);
}