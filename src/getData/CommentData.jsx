import { routeURL } from './ConstantVal'

// /ticket/:id/history
export async function fetchTicketComments(ticketId) {
    try {
        const response = await fetch(`${routeURL}/ticket/comment-history/${ticketId}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const comments = await response.json();
        console.log('Comments fetched successfully:', comments);
        return comments;
    } catch (error) {
        console.error('Error fetching comments:', error.message);
        throw error; 
    }
}