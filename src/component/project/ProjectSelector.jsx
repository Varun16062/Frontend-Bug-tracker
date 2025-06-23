import React, { useState, useEffect } from 'react';
import { ProjectData } from '../../getData/ProjectData';
import { Link, useNavigate } from 'react-router-dom';

const ProjectSelector = ({ onSelectProject }) => {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        ProjectData()
            .then((response) => {
                setProjects(response);
                setLoading(false);
            }).catch((err) => {
                console.error('Error fetching projects:', err);
                setError('Failed to load projects. Please ensure your backend server is running.');
                setLoading(false);
            });
    }, []);

    const handleChange = (event) => {
        const newProjectId = event.target.value;
        setSelectedProjectId(newProjectId);
        if (onSelectProject) {
            onSelectProject(newProjectId);
        }
    };

    console.log(selectedProjectId, 'Selected project ID');

    if(selectedProjectId){
        navigate(`/project/${selectedProjectId}`)
    }

    if (loading) {
        return <div className="text-gray-600">Loading projects...</div>;
    }

    if (error) {
        return <div className="text-red-600">{error}</div>;
    }

    return (
        <div className="mb-6">
            <label htmlFor="project-select" className="block text-gray-700 text-sm font-bold mb-2">
                Select Project:
            </label>
            <select
                id="project-select"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={selectedProjectId}
                onChange={handleChange}
            >
                <option value="">Choose a project </option>
                {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                        <Link to={`/project/${project._id}`}>{project.title}</Link>
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ProjectSelector;