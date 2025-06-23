import { UserData } from "../../getData/UserData";
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { TicketDataById, updateTicket } from '../../getData/TicketData';
import { ProjectData } from '../../getData/ProjectData';

function AssignTicket() {
    const navigate = useNavigate();
    const { ticketId } = useParams();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [status, setStatus] = useState('open');
    const [selectedProjectId, setSelectedProjectId] = useState('');
    // State to store an array of selected user IDs for assignment
    const [selectedUsersId, setSelectedUsersId] = useState([]);

    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]); // All available users

    const [isLoadingTicket, setIsLoadingTicket] = useState(true);
    const [ticketError, setTicketError] = useState(null);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [projectsError, setProjectsError] = useState(null);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true); // Loading state for users
    const [usersError, setUsersError] = useState(null);       // Error state for users
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
                setStatus(data.status);
                setSelectedProjectId(data.projectId?._id || data.projectId || ''); // Handle populated projectId or just ID
                // Initialize selectedUsersId with existing assigned users from the ticket
                if (data.assignedUsers && Array.isArray(data.assignedUsers)) {
                    // Map to just IDs if assignedUsers contains full user objects
                    setSelectedUsersId(data.assignedUsers.map(user => user._id || user));
                } else {
                    setSelectedUsersId([]);
                }
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
    }, []);

    // Fetch Users Data
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoadingUsers(true);
            setUsersError(null);
            try {
                const data = await UserData();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
                setUsersError(error.message || "Failed to load users list.");
                toast.error(error.message || "Failed to load users list.");
            } finally {
                setIsLoadingUsers(false);
            }
        };
        fetchUsers();
    }, []);

    // Handler for multi-select dropdown for users
    const handleUsersChange = (e) => {
        const options = e.target.options;
        const selectedValues = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedValues.push(options[i].value);
            }
        }
        setSelectedUsersId(selectedValues); // Update state with array of selected IDs
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        toast.dismiss(); // Dismiss any existing toasts

        // Client-side validation: only check if users are selected for this specific "assign" form
        if (selectedUsersId.length === 0) {
            toast.error('Please select at least one team member to assign.');
            setIsUpdating(false);
            return;
        }

        const updatedData = {
            assignee: selectedUsersId,
            title,
            description,
            priority,
            status,
            projectId: selectedProjectId,
        };

        console.log("Submitting updated ticket data:", updatedData);

        try {
            const response = await updateTicket(ticketId, updatedData);
            console.log("Ticket updated successfully:", response);
            toast.success("Ticket assigned successfully!");
            navigate(`/`); // Navigate to homepage or ticket details page after update
        } catch (error) {
            console.error("Error updating ticket:", error);
            toast.error(error.message || "Failed to assign ticket.");
        } finally {
            setIsUpdating(false);
        }
    };

    // Consolidated Loading and Error States for all data fetches
    if (isLoadingTicket || isLoadingProjects || isLoadingUsers) {
        return (
            <div className='container mx-auto p-4 mt-18 text-center'>
                <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-blue-500" />
                <p className="mt-2 text-gray-700">Loading ticket, projects, and user data...</p>
            </div>
        );
    }

    if (ticketError || projectsError || usersError) {
        return (
            <div className='container mx-auto p-4 mt-18 text-center'>
                <p className="text-red-600 font-bold text-lg">
                    Error loading data: {ticketError || projectsError || usersError}
                </p>
            </div>
        );
    }

    return (
        <div className="w-11/12 sm:w-2/3 lg:w-1/2 mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 mb-10">
            <h2 className='text-3xl font-extrabold text-gray-900 text-center mb-8'>Assign Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-6">

                <div className="form-group">
                    <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor="ticket-title">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        className='block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm bg-gray-50 cursor-not-allowed'
                        type="text"
                        id="ticket-title"
                        name="title"
                        value={title}
                        disabled
                    />
                </div>

                <div className="form-group">
                    <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor="description">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        className='block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out bg-gray-50 cursor-not-allowed'
                        id="description"
                        name="description"
                        value={description}
                        rows="5"
                        disabled // Disabled as per requirement
                    ></textarea>
                </div>

                <div className="form-group">
                    <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor="priority">
                        Priority <span className="text-red-500">*</span>
                    </label>
                    <input
                        className='block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 transition-all duration-300 ease-in-out shadow-sm bg-gray-50 cursor-not-allowed'
                        id="priority"
                        name="priority"
                        value={priority}
                        disabled // Disabled as per requirement
                    />
                </div>

                <div className="form-group">
                    <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor="status">
                        Status <span className="text-red-500">*</span>
                    </label>
                    <input
                        className='block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 transition-all duration-300 ease-in-out shadow-sm bg-gray-50 cursor-not-allowed'
                        id="status"
                        name="status"
                        value={status}
                        disabled // Disabled as per requirement
                    />
                </div>

                <div className="form-group">
                    <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor="project">
                        Project/Module <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="project"
                        name="project"
                        className='block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparenttext-gray-800 transition-all duration-300 ease-in-out hover:border-blue-400 shadow-sm bg-gray-50 cursor-not-allowed'
                        value={selectedProjectId}
                        disabled // Disabled as per requirement
                    >
                        {/* Display the current project title if available, otherwise a placeholder */}
                        {selectedProjectId ? (
                            <option value={selectedProjectId}>
                                {projects.find(p => p._id === selectedProjectId)?.title || 'Loading Project...'}
                            </option>
                        ) : (
                            <option value="">No Project Selected</option>
                        )}
                    </select>
                </div>

                {/* --- Enabled Field: Members/teams --- */}
                <div className="form-group">
                    <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor="assignedUsers">
                        Members/teams <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="assignedUsers" // Changed ID for clarity
                        name="assignedUsers" // Changed name for clarity
                        multiple // Crucial for multi-selection
                        className='block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800 transition-all duration-300 ease-in-out hover:border-blue-400 shadow-sm h-32'
                        value={selectedUsersId} // Value must be an array of selected IDs
                        onChange={handleUsersChange} // Use the new handler
                        required
                    >
                        {users.length > 0 ? (
                            users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.username || user.name} {/* Use username or name */}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>No users available</option>
                        )}
                    </select>
                    {usersError && <p className="text-red-500 text-sm mt-1">{usersError}</p>}
                    <p className="text-gray-500 text-xs mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple members.</p>
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isUpdating}
                >
                    {isUpdating ? (
                        <>
                            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Assigning Ticket...
                        </>
                    ) : (
                        "Assign Ticket"
                    )}
                </button>
            </form>
        </div>
    );
};

export default AssignTicket;