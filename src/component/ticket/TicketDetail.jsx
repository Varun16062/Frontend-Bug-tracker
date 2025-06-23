import React from 'react';
import { useNavigate } from 'react-router-dom';

function TicketDetail({ ticket, projectName }) {
    const navigate = useNavigate();

    if (!ticket) {
        return <div className="text-center text-gray-500 p-4">No ticket data available.</div>;
    }

    const getPriorityBadgeClasses = (priority) => {
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

    const getStatusBadgeClasses = (status) => {
        switch (status?.toLowerCase()) {
            case 'open':
                return 'bg-blue-100 text-blue-800';
            case 'to do':
                return 'bg-gray-200 text-gray-800';
            case 'in progress':
                return 'bg-blue-100 text-blue-800';
            case 'done':
                return 'bg-emerald-100 text-emerald-800';
            case 'closed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    const formattedCreatedAt = ticket.createdAt
        ? new Date(ticket.createdAt).toLocaleDateString()
        : 'N/A';

    return (
        <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out border border-gray-200">
            <h3 className="text-2xl font-extrabold text-gray-900 mb-4 border-b pb-2">
                {ticket.title || 'Untitled Ticket'}
            </h3>

            <p className="text-gray-700 text-base mb-6 leading-relaxed whitespace-pre-wrap">
                {ticket.description || 'No description provided.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm mb-6">

                <div className="flex items-center">
                    <span className="font-semibold text-gray-600 min-w-[80px]">Priority:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadgeClasses(ticket.priority)}`}>
                        {ticket.priority || 'N/A'}
                    </span>
                </div>

                <div className="flex items-center">
                    <span className="font-semibold text-gray-600 min-w-[80px]">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(ticket.status)}`}>
                        {ticket.status || 'N/A'}
                    </span>
                </div>

                <div className="flex items-center">
                    <span className="font-semibold text-gray-600 min-w-[80px]">Created:</span>
                    <span className="text-gray-700">{formattedCreatedAt}</span>
                </div>

                <div className="flex items-center">
                    <span className="font-semibold text-gray-600 min-w-[80px]">Project:</span>
                    <span className="text-gray-700">{projectName || 'N/A'}</span>
                </div>

                <div className="flex items-start col-span-full">
                    <span className="font-semibold text-gray-600 min-w-[80px] pt-1">Assignee(s):</span>
                    <div className="flex flex-wrap gap-2 flex-grow">
                        {ticket.assignee && ticket.assignee.length > 0 ? (
                            ticket.assignee.map((assigneeId, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                                    {assigneeId}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-500 italic">Unassigned</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => navigate(`/ticket/update-ticket/${ticket._id}`)}
                >
                    Update Ticket
                </button>
            </div>
        </div>
    );
}

export default TicketDetail;