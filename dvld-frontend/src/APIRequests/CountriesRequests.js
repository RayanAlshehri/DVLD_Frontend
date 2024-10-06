import axios from "axios";

const api = axios.create ({
    baseURL: "https://localhost:61362/api/countries",
    headers: {
        'Content-Type': 'application/json',
    },
})

export const getAllCountries = () => {
    return api.get();
}