import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:61362/api/test-types",
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getTestType = (testTypeId) => {
    return api.get(`/${testTypeId}`);
}