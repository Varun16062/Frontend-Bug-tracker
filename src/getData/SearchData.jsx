import axios from 'axios';
import { routeURL } from "./ConstantVal";



export const searchProjects = async (key) => {
    try {
        const response = await axios.get(`${routeURL}/search-project/${key}`);
        return response.data;
    } catch (error) {
        console.error("Error searching projects:", error);
        if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error response headers:", error.response.headers);
            throw new Error(`Failed to search projects: ${error.response.status} - ${error.response.data.message || 'Server error'}`);
        } else if (error.request) {
            throw new Error("No response received from server. Check network connection.");
        } else {
            throw new Error(`Error setting up request: ${error.message}`);
        }
    }
};

export const searchTickets = async (key) => {
    try {
        const response = await axios.get(`${routeURL}/search-ticket/${key}`);
        return response.data;
    } catch (error) {
        console.error("Error searching tickets:", error);
        if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
            throw new Error(`Failed to search tickets: ${error.response.status} - ${error.response.data.message || 'Server error'}`);
        } else if (error.request) {
            throw new Error("No response received from server. Check network connection.");
        } else {
            throw new Error(`Error setting up request: ${error.message}`);
        }
    }
};