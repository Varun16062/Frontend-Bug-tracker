import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faClipboardList, faInfoCircle, faCalendarAlt, faUsers, faEdit, faTicketAlt } from '@fortawesome/free-solid-svg-icons';

import { ProjectDataById } from '../../getData/ProjectData';
import { UserDataById } from '../../getData/UserData';

const ProjectDetail = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [teamMemberNames, setTeamMemberNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProjectDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const projectResponse = await ProjectDataById(projectId);
            setProject(projectResponse);

            if (projectResponse.teamMembers && projectResponse.teamMembers.length > 0) {
                const memberPromises = projectResponse.teamMembers.map(async memberId => {
                    try {
                        const user = await UserDataById(memberId);
                        return user.name || 'Unknown User';
                    } catch (err) {
                        console.warn(`Could not fetch user ID ${memberId}:`, err);
                        return 'Unknown User';
                    }
                });
                const fetchedNames = await Promise.all(memberPromises);
                setTeamMemberNames(fetchedNames);
            } else {
                setTeamMemberNames([]);
            }
        } catch (err) {
            console.error('Error fetching project details:', err);
            setError(err.message || 'Failed to load project details.');
            toast.error(err.message || 'Failed to load project details!');
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchProjectDetails();
    }, [fetchProjectDetails]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        try {
            return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
        } catch (e) {
            console.error('Error formatting date:', dateString, e);
            return 'Invalid Date';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center text-blue-600">
                    <FontAwesomeIcon icon={faSpinner} spin size="3x" className="mb-4" />
                    <p className="text-lg">Loading project details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center text-red-600 bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                    <p className="text-xl font-semibold mb-4">Error!</p>
                    <p className="mb-4">{error}</p>
                    <button
                        onClick={fetchProjectDetails}
                        className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                        Retry Loading
                    </button>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-700 bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                    <p className="text-xl font-semibold mb-4">Project Not Found</p>
                    <p>The project you are looking for does not exist or has been deleted.</p>
                    <Link to="/project" className="mt-6 inline-block bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                        Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center flex items-center justify-center">
                    <FontAwesomeIcon icon={faClipboardList} className="mr-3 text-blue-600" />
                    Project Details
                </h1>

                <div className="space-y-6">
                    {/* Project Title */}
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1 flex items-center">
                            <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-gray-400" />Title:
                        </p>
                        <p className="text-3xl font-bold text-blue-700 leading-tight">{project.title}</p>
                    </div>

                    {/* Project Description */}
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1 flex items-center">
                            <FontAwesomeIcon icon={faClipboardList} className="mr-2 text-gray-400" />Description:
                        </p>
                        <p className="text-gray-800 text-lg leading-relaxed bg-gray-50 p-4 rounded-md border border-gray-200">{project.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Project Status */}
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1 flex items-center">
                                <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-gray-400" />Status:
                            </p>
                            <span
                                className={`px-4 py-2 rounded-full text-sm font-medium ${project.status === 'Not Started'
                                    ? 'bg-red-100 text-red-800'
                                    : project.status === 'In Progress'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-green-100 text-green-800'
                                    }`}
                            >
                                {project.status}
                            </span>
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1 flex items-center">
                                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-gray-400" />Created At:
                            </p>
                            <p className="text-gray-700">{formatDate(project.createdAt)}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1 flex items-center">
                            <FontAwesomeIcon icon={faUsers} className="mr-2 text-gray-400" />Team Members:
                        </p>
                        {teamMemberNames.length > 0 ? (
                            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                                {teamMemberNames.map((name, index) => (
                                    <li key={index} className="text-base">{name}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600 italic">No team members assigned.</p>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pt-6 mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className='text-gray-400 text-sm'>
                            <strong>Project ID:</strong> {project._id}
                        </p>
                        <div className="flex gap-3">
                            <Link to={`/ticket/project-ticket/${project._id}`}>
                                <button className='bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition-colors duration-200 flex items-center'>
                                    <FontAwesomeIcon icon={faTicketAlt} className="mr-2" />Show Tickets
                                </button>
                            </Link>
                            <Link to={`/project/update-Project/${project._id}`}>
                                <button className='bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md transition-colors duration-200 flex items-center'>
                                    <FontAwesomeIcon icon={faEdit} className="mr-2" />Edit Project
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;