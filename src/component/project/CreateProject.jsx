import React, { useState } from 'react';
import { NewProject } from '../../getData/ProjectData';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function CreateProject() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Not Started');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.dismiss();

        if (!title.trim() || !description.trim()) {
            toast.error('Title and description are required.');
            return;
        }

        setIsSubmitting(true);

        const projectData = {
            title,
            description,
            status,
            createdAt: new Date(),
        };

        console.log(projectData)

        try {
            const response = await NewProject(projectData); 
            console.log('Project Created Successfully:', response);
            toast.success('Project created successfully!');

            setTitle('');
            setDescription('');
            setStatus('not_started');

            navigate('/project');
        } catch (error) {
            console.error('Error creating project:', error);
            toast.error(error.message || 'Failed to create project. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='container mx-auto mt-10 p-6 max-w-lg bg-white rounded-xl shadow-lg'>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
                Create New Project
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
                            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Creating...
                        </>
                    ) : (
                        "Create Project"
                    )}
                </button>
            </form>
        </div>
    );
}

export default CreateProject;