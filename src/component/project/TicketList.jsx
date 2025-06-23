import React, { useState, useEffect, useCallback } from "react";
import { TicketDataByProjectId } from '../../getData/TicketData';
import { useParams, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationTriangle, faTicketAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

function TicketList() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { projectId } = useParams();

    // The getTicketData useCallback is already very good.
    const getTicketData = useCallback(async (currentProjectId) => {
        setLoading(true);
        setError(null);
        setTickets([]); // Clear previous tickets

        try {
            if (!currentProjectId) {
                // This check is good. It prevents unnecessary API calls and sets a clear error.
                setError('No project ID provided in the URL to fetch tickets.');
                setLoading(false);
                return;
            }

            const response = await TicketDataByProjectId(currentProjectId);
            console.log('TicketDataByProjectId response:', response);

            // The backend might return a 404 for "no tickets found", but your current backend
            // code returns { message: "No tickets found..." } for 404.
            // If the backend returns 200 with an empty array for no tickets,
            // this `if (Array.isArray(response))` check is perfect.
            // If the backend returns a 404, that would be caught by `TicketDataByProjectId`'s `handleApiError`
            // and re-thrown, landing in this `catch` block.
            if (Array.isArray(response)) {
                setTickets(response);
                // Only show success if tickets were actually found, or if an empty array is a 'success'
                if (response.length > 0) {
                    toast.success('Tickets loaded successfully!');
                } else {
                    toast.info('No tickets found for this project yet.');
                }
            } else {
                console.error('API response is not an array:', response);
                setError('Received unexpected data format from the ticket API.');
                setTickets([]); // Ensure tickets array is empty
                toast.error('Received unexpected data format from the ticket API.'); // Add toast for this specific case
            }
        } catch (err) {
            console.error('Error fetching tickets in TicketList component:', err);
            // The handleApiError in TicketDataByProjectId already displays a toast.
            // You might not want a duplicate toast here.
            // This catch block is primarily for updating local component state (error, loading, tickets)
            // based on the re-thrown error from TicketDataByProjectId.
            let errorMessage = err.message || 'Failed to load tickets.';
            // Check if the error is from a specific 404 response indicating no tickets
            if (err.response && err.response.status === 404 && err.response.data.message === "No tickets found for this project.") {
                errorMessage = "No tickets found for this project.";
                // Don't set an error state that shows the retry button if it's genuinely 'no tickets'
                setError(null); // Clear error for this specific case
                setTickets([]); // Ensure empty array
                toast.info(errorMessage); // Use info toast
            } else {
                setError(errorMessage); // Set error for actual failures
                setTickets([]); // Ensure empty array on real error
                toast.error(errorMessage); // Show toast for real error
            }

        } finally {
            setLoading(false); // Always set loading to false in finally
        }
    }, []); // `projectId` should be in the dependency array of `useCallback` if it's used inside, but it's passed as `currentProjectId`. If `projectId` were directly used inside the effect/callback without being passed, it would need to be a dependency. Here, it's fine.

    useEffect(() => {
        if (projectId) {
            getTicketData(projectId);
        } else {
            setLoading(false);
            setError('Please select a project to view tickets.');
            toast.info('Please select a project to view tickets.'); // Add toast for this
        }
    }, [projectId, getTicketData]);

    console.log('Current state of tickets (for rendering):', tickets);

    return (
        <div className="bg-white py-12 sm:py-16 min-h-screen">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl flex items-center">
                        <FontAwesomeIcon icon={faTicketAlt} className="mr-4 text-blue-600" />
                        Tickets
                    </h2>
                    <br />
                    {/* CONSIDER: If 'addTicket' needs the projectId, pass it in the URL */}
                    {/* Example: <Link to={`/project/${projectId}/ticket/add`} ... /> */}
                    <Link to={`/ticket/addTicket/`} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md">
                        Create New Ticket
                    </Link>
                    <p className="mt-2 text-lg text-gray-600">Project bugs, issues, and feature requirements.</p>
                </div>

                <div className="mx-auto mt-10 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none relative">
                    {loading ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-10">
                            <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-blue-600 mb-4" />
                            <p className="text-lg text-gray-700">Loading tickets...</p>
                        </div>
                    ) : error ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
                            <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="text-red-500 mb-4" />
                            <p className="text-xl font-semibold text-red-700 mb-4">Error Loading Tickets!</p>
                            <p className="text-gray-700 mb-6">{error}</p>
                            <button
                                onClick={() => getTicketData(projectId)}
                                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center mx-auto"
                            >
                                <FontAwesomeIcon icon={faSpinner} spin={loading} className="mr-2" /> Retry
                            </button>
                        </div>
                    ) : tickets.length > 0 ? (
                        <ul className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                            {tickets.map((ticket) => (
                                <li key={ticket._id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"> {/* Added some styling for list items */}
                                    <Link to={`/ticket/ticket-view/${ticket._id}`} className="block"> {/* Make the whole card clickable */}
                                        <h3 className="text-xl font-semibold text-gray-800 mb-1">{ticket.title}</h3>
                                        {/* Display creation date/time if available */}
                                        {ticket.createdAt && (
                                            <p className="text-xs text-gray-500 mb-2">
                                                Created: {new Date(ticket.createdAt).toLocaleDateString()}
                                            </p>
                                        )}
                                        <p className="text-gray-600 text-sm line-clamp-2">{ticket.description}</p>
                                        {/* Add more ticket details here, e.g., status, priority */}
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {ticket.status && (
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ticket.status === 'Open' ? 'bg-green-100 text-green-800' :
                                                        ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                                            ticket.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                                                                'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {ticket.status}
                                                </span>
                                            )}
                                            {ticket.priority && (
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ticket.priority === 'High' ? 'bg-red-100 text-red-800' :
                                                        ticket.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                                                            'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {ticket.priority}
                                                </span>
                                            )}
                                            {/* Add assignee, type etc. if available */}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-10 text-center bg-gray-50 p-8 rounded-lg shadow-inner">
                            <p className="text-xl text-gray-600 mb-6">
                                No tickets found for this project.
                            </p>
                            {/* The Link for creating a new ticket should ideally pass the projectId */}
                            {/* If create-ticket needs projectId as a prop or part of the URL, adjust this: */}
                            {/* Example: <Link to={`/project/${projectId}/ticket/create`} ... /> */}
                            <Link to={`/ticket/addTicket`} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                <FontAwesomeIcon icon={faPlus} className="mr-2" /> Create New Ticket
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TicketList;