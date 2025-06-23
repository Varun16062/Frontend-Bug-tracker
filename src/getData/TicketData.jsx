import axios from 'axios';
import { routeURL } from "./ConstantVal";

const handleApiError = (error, defaultMessage) => {
    console.error('API Error:', error);
    let errorMessage = defaultMessage;
    if (error.response) {
        // Server responded with a status other than 2xx
        errorMessage = error.response.data.message || error.response.data.error || defaultMessage;
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
    } else if (error.request) {
        // Request was made but no response was received
        errorMessage = 'No response from server. Please check your network connection.';
        console.error('Request data:', error.request);
    } else {
        // Something else happened while setting up the request
        errorMessage = error.message;
    }
    throw new Error(errorMessage);
};

export async function createTicket(data) {
    try {
        // Correctly retrieve the token string from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            // Handle case where token is not found (e.g., user not logged in)
            throw new Error('Authentication token not found. Please log in.');
        }

        const headers = {
            // Use 'Authorization' with capital 'A' for standard practice
            "Authorization": `Bearer ${token}`
        }
        // IMPORTANT: Send the 'data' object directly as the request body
        const response = await axios.post(`${routeURL}/ticket/`, data, { headers });
        console.log('Ticket created successfully:', response.data);
        return response.data;
    } catch (error) {
        // Pass the error to the common error handler
        handleApiError(error, 'Failed to create ticket. Please check your input and try again.');
        // Re-throw the error so the calling component can catch it
        throw error;
    }
}

export async function TicketData() {
    try {
        const response = await axios.get(`${routeURL}/ticket`);
        console.log('Fetched all tickets:', response.data);
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to load tickets. Please ensure your backend server is running.');
    }
}

export async function TicketDataById(ticketId) {
    try {
        const response = await axios.get(`${routeURL}/ticket/${ticketId}`);
        console.log(`Fetched ticket data for ID ${ticketId}:`, response.data);
        return response.data;
    } catch (error) {
        handleApiError(error, `Failed to load ticket with ID ${ticketId}.`);
    }
}

export async function updateTicket(ticketId, updatedData) {
    try {
        const response = await axios.put(`${routeURL}/ticket/${ticketId}`, updatedData);
        console.log(`Updated ticket ${ticketId}:`, response.data);
        return response.data;
    } catch (error) {
        handleApiError(error, `Failed to update ticket with ID ${ticketId}.`);
    }
}


export async function TicketDataByProjectId(projectId) {
    try {
        if (!projectId) {
            console.warn("TicketDataByProjectId called without a projectId.");
            throw new Error("Project ID is required to fetch tickets.");
        }

        const response = await axios.get(`${routeURL}/project-ticket/${projectId}`);
        console.log(`Fetched tickets for project ID ${projectId}:`, response.data);
        return response.data;
    } catch (error) {
        handleApiError(error, `Failed to load tickets for project ID ${projectId}.`);
        throw error;
    }
}

export async function UpdateTicketStatus(ticketId, status) {
    try {
        const response = await axios.put(`${routeURL}/ticket/${ticketId}/status`, { status });
        console.log(`Updated ticket ${ticketId} status to ${status}:`, response.data);
        return response.data;
    } catch (error) {
        handleApiError(error, `Failed to update ticket status for ID ${ticketId}.`);
    }
}

export async function addCommentToTicket(commentData) {
    try {
        const response = await axios.post(`${routeURL}/ticket/comment`, commentData);
        console.log('Added comment:', response.data);
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to add comment to ticket.');
    }
}

export async function deleteTicket(ticketId) {
    try {
        const response = await axios.delete(`${routeURL}/ticket/${ticketId}`);
        console.log(`Deleted ticket ${ticketId}:`, response.data);
        return response.data;
    } catch (error) {
        handleApiError(error, `Failed to delete ticket with ID ${ticketId}.`);
    }
}

export async function NewComment(commentData) {
    try {
        const response = await axios.post(`${routeURL}/ticket/comment`, commentData);
        console.log('Comment created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating comment:', error);
        throw new Error('Failed to create comment. Please ensure your backend server is running.');
    }
}

export async function getCommentHistory(ticketId) {
    try {
        const response = await axios.get(`${routeURL}/ticket/comment-history/${ticketId}`);
        console.log(`Fetched comment history for ticket ${ticketId}:`, response.data);
        return response.data;
    } catch (error) {
        handleApiError(error, `Failed to fetch comment history for ticket ID ${ticketId}.`);
    }
}