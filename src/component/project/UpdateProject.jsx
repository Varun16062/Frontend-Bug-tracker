import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faSave, faProjectDiagram, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { ProjectDataById, ProjectUpdate } from '../../getData/ProjectData';

function UpdateProject() {
    const navigate = useNavigate();
    const { projectId } = useParams();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Not Started');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true);
            setError(null);
            try {
                const project = await ProjectDataById(projectId);
                setTitle(project.title || '');
                setDescription(project.description || '');
                setStatus(project.status || 'Not Started');
                toast.success('Project data loaded successfully!');
            } catch (err) {
                console.error("Error fetching project data for update:", err);
                setError(err.message || 'Failed to load project details for update. Please try again.');
                toast.error(err.message || 'Failed to load project for editing!');
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [projectId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.dismiss();
        if (!title  || !description ) {
            toast.error('Title and description are required.');
            return;
        }

        setIsSubmitting(true);

        const updatedProject = {
            title: title ,
            description: description ,
            status,
        };

        try {
            await ProjectUpdate(projectId, updatedProject);
            toast.success('Project updated successfully!');
            navigate(`/project/${projectId}`);
        } catch (err) {
            console.error("Error updating project:", err);
            toast.error(err.message || 'Failed to update project. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
                <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-blue-600 mb-4" />
                <p className="text-lg text-gray-700">Loading project data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full">
                    <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="text-red-500 mb-4" />
                    <p className="text-xl font-semibold text-red-700 mb-4">Error</p>
                    <p className="mb-4">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='container mx-auto mt-10 p-6 max-w-lg bg-white rounded-xl shadow-lg'>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center flex items-center justify-center">
                <FontAwesomeIcon icon={faProjectDiagram} className="mr-3 text-blue-600" />
                Update Project
            </h1>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">Title:</label>
                    <input
                        type="text"
                        id="title"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out hover:border-blue-400 shadow-sm"
                        placeholder="Enter project title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Description:</label>
                    <textarea
                        id="description"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out hover:border-blue-400 shadow-sm"
                        placeholder="Enter project description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4" 
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">Status:</label>
                    <select
                        id="status"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800 transition-all duration-300 ease-in-out hover:border-blue-400 shadow-sm"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="on_hold">On Hold</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Updating...
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faSave} className="mr-2" /> Update Project
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

export default UpdateProject;