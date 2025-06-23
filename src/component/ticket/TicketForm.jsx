import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { ProjectData } from '../../getData/ProjectData'; // Assuming this fetches projects correctly
import { createTicket } from '../../getData/TicketData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const TicketForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [projectId, setProjectId] = useState(""); // State for selected project ID

    const [projects, setProjects] = useState([]); // State to store fetched projects

    const [loadingProjects, setLoadingProjects] = useState(true);
    const [projectError, setProjectError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchProjects = useCallback(async () => {
        setLoadingProjects(true);
        setProjectError(null);
        try {
            const response = await ProjectData();
            setProjects(response);
            if (response.length > 0) {
                // Automatically select the first project if available
                setProjectId(response[0]._id);
            }
        } catch (err) {
            console.error('Error fetching projects:', err);
            setProjectError(err.message || 'Failed to load projects.');
        } finally {
            setLoadingProjects(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        toast.dismiss(); // Dismiss any existing toasts

        if (!title || !description || !projectId) {
            toast.error('Please fill in all required fields (Title, Description, Project).');
            setIsSubmitting(false);
            return;
        }

        const newTicketData = {
            title,
            description,
            priority,
            // Removed 'assignee: []' as it's not being set by the form and
            // your schema expects a single ObjectId or null.
            // If you need an assignee, you would add a field for it in the form
            // and populate it here with a valid User ObjectId.
            status: "open", // Default status from schema, can be omitted if not needed for submission
            projectId,
        };

        console.log("Submitting new ticket data:", newTicketData);

        try {
            const response = await createTicket(newTicketData);
            toast.success("Ticket created successfully!");
            console.log("Ticket creation response:", response);

            // Clear the form fields after successful submission
            setTitle("");
            setDescription("");
            setPriority("medium");
            // Note: ProjectId is usually left selected or reset based on UX
            // setProjectId(projects.length > 0 ? projects[0]._id : ""); // Optionally reset to first project or empty
        } catch (error) {
            console.error("Error submitting ticket:", error);
            // The handleApiError in createTicket already throws an error with a message
            // so we can directly use error.message here.
            toast.error(error.message || "There was an error creating the ticket!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-11/12 sm:w-2/3 lg:w-1/2 mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Create New Ticket</h2>
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
                        placeholder="Enter ticket title"
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
                        placeholder="Provide a detailed description of the issue or feature"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor="priority">
                        Priority <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800 transition-all duration-300 ease-in-out hover:border-blue-400 shadow-sm"
                        id="priority"
                        name="priority"
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                        required
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor="project">
                        Project/Module <span className="text-red-500">*</span>
                    </label>
                    {loadingProjects ? (
                        <div className="text-gray-500 flex items-center justify-center p-3">
                            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Loading projects...
                        </div>
                    ) : projectError ? (
                        <p className="text-red-500 text-sm">{projectError}</p>
                    ) : (
                        <select
                            id="project-select"
                            className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800 transition-all duration-300 ease-in-out hover:border-blue-400 shadow-sm"
                            value={projectId}
                            onChange={e => setProjectId(e.target.value)}
                            required
                        >
                            <option value="" >-- Choose a Project --</option>
                            {projects.map((proj) => (
                                <option key={proj._id} value={proj._id}>
                                    {proj.title}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Creating Ticket...
                        </>
                    ) : (
                        "Create Ticket"
                    )}
                </button>
            </form>
        </div>
    );
};

export default TicketForm;