import React from 'react';
import { Link } from 'react-router-dom';

function TicketUI({ data }) {
    const getStatusBadgeClasses = (status) => {
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

    const formattedDate = data.createdAt
        ? new Date(data.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
        : 'N/A';

    return (
        <Link to={`/ticket/${data._id}`} className="block">
            <article className="flex flex-col w-full min-h-45 p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 ease-in-out">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col">
                        <time dateTime={data.createdAt} className="text-sm text-gray-500">
                            Created: {formattedDate}
                        </time>

                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClasses(data.status)}`}>
                        {data.status || 'Unknown Status'}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 leading-tight mb-2 truncate">
                    {data.title || 'No Title'}
                </h3>

                <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-2 text-sm text-gray-700">
                    <div>
                        <strong className="font-semibold">Assignee(s): </strong>
                        {data.assignee && data.assignee.length > 0 ? (
                            <ul className='inline-flex flex-wrap gap-1 ml-1'>
                                {data.assignee.map((assigneeId, index) => (
                                    <li key={index} className="px-2 py-0.5 bg-gray-200 rounded-full text-xs font-medium">
                                        {assigneeId}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <span>N/A</span>
                        )}
                    </div>
                    <div className="flex items-center sm:ml-4">
                        <strong className="font-semibold mr-1">Project: </strong>
                        <span className="text-gray-800">{data.projectName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center sm:ml-4">
                        <strong className="font-semibold mr-1">Priority: </strong>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getPriorityBadgeClasses(data.priority)}`}>
                            {data.priority || 'N/A'}
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}

export default TicketUI;