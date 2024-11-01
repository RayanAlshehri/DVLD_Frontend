import axios from "axios";

const api = axios.create ({
    baseURL: "https://localhost:61362/api/users",
    headers: {
        'Content-Type': 'application/json',
    },
})

export const getAllUsers = () => {
    return api.get();
}

export const getUserById = (userId) => {
    return api.get(`./${userId}`);
}

export const getUserByUsernameAndPassword = (Username, Password) => {
    return api.get(`./${Username}/${Password}`);
}

export const doesUserExistByPersonId = (personId) => {
    return api.get(`./${personId}/does-exist`);
}

export const doesUserExistByUsername = (username) => {
    return api.get(`./${username}/does-exist`);
}

export const getTotalNumberOfUsers = () => {
    return api.get("/total-number-of-users");
}

export const addNewUser = (user) => {
    return api.post('', user);
}

export const updateUser = (userId, user) => {
    return api.put(`./${userId}`, user);
}

export const updatePassword = (userId, password) => {
    return api.patch(`./${userId}/${password}`);
}

export const deleteUser = (userId) => {
    return api.delete(`./${userId}`)
}