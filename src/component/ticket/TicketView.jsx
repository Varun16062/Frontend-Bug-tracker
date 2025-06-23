import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { TicketDataById } from '../../getData/TicketData';
import { ProjectDataById } from '../../getData/ProjectData';
import Comment from './Comment';

function TicketView() {
    const [ticket, setTicket] = useState(null);
    const [projectName, setProjectName] = useState('Loading...');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { ticketId } = useParams();

    const fetchTicketAndProject = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setProjectName('Loading...');

        try {
            const ticketData = await TicketDataById(ticketId);
            setTicket(ticketData);
            console.log('Fetched Ticket Data:', ticketData);

            if (ticketData && ticketData.projectId) {
                const projectResponse = await ProjectDataById(ticketData.projectId);
                setProjectName(projectResponse.title || 'N/A');
                console.log('Fetched Project Data:', projectResponse);
            } else {
                setProjectName('No Project Assigned');
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message || 'Failed to load ticket details.');
            toast.error(err.message || 'Failed to load ticket details. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [ticketId]);

    useEffect(() => {
        fetchTicketAndProject();
    }, [fetchTicketAndProject]);

    const getPriorityBadge = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'open':
            case 'to do':
                return 'bg-blue-100 text-blue-800';
            case 'in progress':
                return 'bg-purple-100 text-purple-800';
            case 'done':
            case 'closed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-blue-500 mr-2" />
                <p className="text-xl text-gray-700">Loading ticket details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
                <p className="text-2xl font-bold mb-4">Error:</p>
                <p className="text-lg">{error}</p>
                <button
                    onClick={fetchTicketAndProject}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500 text-xl">
                <p>Ticket not found.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg my-8">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 border-b pb-3">{ticket.title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <p className="text-gray-600">
                        <span className="font-semibold text-gray-800">Project:</span>{" "}
                        <span className="text-blue-700 font-medium">{projectName}</span>
                    </p>
                </div>
                <div>
                    <p className="text-gray-600">
                        <span className="font-semibold text-gray-800">Priority:</span>
                        <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadge(ticket.priority)}`}>
                            {ticket.priority || 'N/A'}
                        </span>
                    </p>
                </div>
                <div>
                    <p className="text-gray-600">
                        <span className="font-semibold text-gray-800">Status:</span>
                        <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(ticket.status)}`}>
                            {ticket.status || 'N/A'}
                        </span>
                    </p>
                </div>
                <div>
                    <p className="text-gray-600">
                        <span className="font-semibold text-gray-800">Created At:</span>{" "}
                        {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A'}
                    </p>
                </div>
            </div>
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 border-b pb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{ticket.description || 'No description provided.'}</p>
            </div>


            {ticketId && <Comment ticketId={ticketId} />}
        </div>
    );
}

export default TicketView;