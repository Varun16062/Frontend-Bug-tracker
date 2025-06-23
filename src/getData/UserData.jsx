import axios from 'axios';
import { routeURL } from "./ConstantVal";

const handleApiError = (error, defaultMessage) => {
    console.error('API Error:', error.response ? error.response.data : error.message);
    let errorMessage = defaultMessage;
    if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
    } else if (error.message) {
        errorMessage = error.message;
    }
    throw new Error(errorMessage);
};

export async function UserData() {
    try {
        const response = await axios.get(`${routeURL}/user`);
        console.log('Fetched all user data:', response.data);
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to load all users. Please ensure your backend server is running.');
    }
}

export async function UserDataById(id) {
    if (!id) {
        throw new Error("User ID is required to fetch user data by ID.");
    }
    try {
        console.log('Fetching user data by ID:', id);
        const response = await axios.get(`${routeURL}/user/${id}`);
        console.log('Fetched user data by ID:', response.data);
        return response.data;
    } catch (error) {
        handleApiError(error, `Failed to load user with ID: ${id}.`);
    }
}