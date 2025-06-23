import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { TicketDataById, updateTicket } from '../../getData/TicketData'; // Assuming these functions exist and work
import { ProjectData } from '../../getData/ProjectData'; // Assuming this function exists and works

const UpdateTicket = () => {
    const navigate = useNavigate();
    const { ticketId } = useParams();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    // Corrected: Initial status should match schema enum values (lowercase)
    const [status, setStatus] = useState('open');
    const [selectedProjectId, setSelectedProjectId] = useState('');

    const [projects, setProjects] = useState([]);

    const [isLoadingTicket, setIsLoadingTicket] = useState(true);
    const [ticketError, setTicketError] = useState(null);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [projectsError, setProjectsError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Fetch Ticket Data
    useEffect(() => {
        const fetchTicket = async () => {
            setIsLoadingTicket(true);
            setTicketError(null);
            try {
                const data = await TicketDataById(ticketId);
                setTitle(data.title);
                setDescription(data.description);
                setPriority(data.priority);
                // Ensure status from backend matches enum values for consistency
                setStatus(data.status);
                setSelectedProjectId(data.projectId || ''); // Safely set project ID, default to empty string if null/undefined
            } catch (error) {
                setTicketError(error.message || "Failed to load ticket details.");
                toast.error(error.message || "Failed to load ticket details.");
            } finally {
                setIsLoadingTicket(false);
            }
        };

        if (ticketId) {
            fetchTicket();
        }
    }, [ticketId]);

    // Fetch Projects Data
    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoadingProjects(true);
            setProjectsError(null);
            try {
                const data = await ProjectData();
                setProjects(data);
            } catch (error) {
                console.error("Error fetching projects:", error);
                setProjectsError(error.message || "Failed to load projects list.");
                toast.error(error.message || "Failed to load projects list.");
            } finally {
                setIsLoadingProjects(false);
            }
        };

        fetchProjects();
    }, []); // Empty dependency array means this runs once on mount

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        toast.dismiss(); // Dismiss any existing toasts

        // Client-side validation
        if (!title || !description || !selectedProjectId) {
            toast.error('Please fill in all required fields (Title, Description, Project).');
            setIsUpdating(false);
            return;
        }

        const updatedData = {
            title,
            description,
            priority,
            status, // This value should now correctly match schema enum
            projectId: selectedProjectId,
        };

        console.log("Submitting updated ticket data:", updatedData);

        try {
            const response = await updateTicket(ticketId, updatedData);
            console.log("Ticket updated successfully:", response);
            toast.success("Ticket updated successfully!");
            navigate(`/`); // Navigate to homepage or ticket details page after update
        } catch (error) {
            console.error("Error updating ticket:", error);
            // The `updateTicket` function (if it uses handleApiError) should already
            // throw an error with a user-friendly message.
            toast.error(error.message || "Failed to update ticket.");
        } finally {
            setIsUpdating(false);
        }
    };

    // Consolidated Loading and Error States
    if (isLoadingTicket || isLoadingProjects) {
        return (
            <div className='container mx-auto p-4 mt-18 text-center'>
                <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-blue-500" />
                <p className="mt-2 text-gray-700">Loading ticket and projects data...</p>
            </div>
        );
    }

    if (ticketError || projectsError) {
        return (
            <div className='container mx-auto p-4 mt-18 text-center'>
                <p className="text-red-600 font-bold text-lg">
                    Error loading data: {ticketError || projectsError}
                </p>
            </div>
        );
    }

    return (
        <div className="w-11/12 sm:w-2/3 lg:w-1/2 mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 mb-10">
            <h2 className='text-3xl font-extrabold text-gray-900 text-center mb-8'>Update Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-6">

                <div className="form-group">
                    <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor="ticket-title">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        className='block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out hover:border-blue-400 shadow-sm'
                        type="text"
                        id="ticket-title"
                        name="title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor="description">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        className='block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out hover:border-blue-400 shadow-sm'
                        id="description"
                        name="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows="5"
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor="priority">
                        Priority <span className="text-red-500">*</span>
                    </label>
                    <select
                        className='block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800 transition-all duration-300 ease-in-out hover:border-blue-400 shadow-sm'
                        id="priority"
                        name="priority"
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor="status">
                        Status <span className="text-red-500">*</span>
                    </label>
                    <select
                        className='block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800 transition-all duration-300 ease-in-out hover:border-blue-400 shadow-sm'
                        id="status"
                        name="status"
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                    >
                        <option value="open">Open</option>
                        <option value="to_do">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor="project">
                        Project/Module <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="project"
                        name="project"
                        className='block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800 transition-all duration-300 ease-in-out hover:border-blue-400 shadow-sm'
                        value={selectedProjectId}
                        onChange={e => setSelectedProjectId(e.target.value)}
                        required
                    >
                        <option value="" disabled>-- Choose a project --</option>
                        {projects.map((proj) => (
                            <option key={proj._id} value={proj._id}>
                                {proj.title}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isUpdating}
                >
                    {isUpdating ? (
                        <>
                            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Updating Ticket...
                        </>
                    ) : (
                        "Update Ticket"
                    )}
                </button>
            </form>
        </div>
    );
};

export default UpdateTicket;