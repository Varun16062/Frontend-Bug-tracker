import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

function ProjectContent({ project, onDelete }) {
    if (!project) {
        return (
            <div className="text-center text-gray-500 p-4">
                No project data available.
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'not started':
                return 'bg-red-100 text-red-800';
            case 'in progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'on hold':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatProjectDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            console.error("Error formatting date:", dateString, e);
            return 'Invalid Date';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 ease-in-out w-full flex flex-col justify-between">
            <div>
                <Link to={`/project/${project._id}`} className="block">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-700 transition-colors duration-200">
                        {project.title || 'Untitled Project'}
                    </h2>
                </Link>

                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {project.description || 'No description provided.'}
                </p>

                <div className="flex items-center mb-2">
                    <span className="font-semibold text-gray-600 mr-2">Status:</span>
                    <span className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${getStatusColor(project.status || 'default')}
                    `}>
                        {project.status || 'N/A'}
                    </span>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                    <span className="font-semibold text-gray-600 mr-2">Created On:</span>
                    <span>
                        {formatProjectDate(project.createdAt)}
                    </span>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
                <Link to={`/project/${project._id}`}>
                    <button
                        className="bg-slate-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition duration-200 flex items-center"
                    >
                        <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-1" /> Details
                    </button>
                </Link>

                <Link to={`/project/update-Project/${project._id}`}>
                    <button
                        className="bg-cyan-400 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm transition duration-200 flex items-center"
                    >
                        <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit
                    </button>
                </Link>

                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete(project._id);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition duration-200 flex items-center"
                    >
                        <FontAwesomeIcon icon={faTrashAlt} className="mr-1" /> Delete
                    </button>
                )}
            </div>
        </div>
    );
}

export default ProjectContent;