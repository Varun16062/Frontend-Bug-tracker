import axios from 'axios';
import { routeURL } from "./ConstantVal";

const handleApiError = (error, defaultMessage) => {
    console.error('API Error:', error.response ? error.response.data : error.message);
    let errorMessage = defaultMessage;
    if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
    } else if (error.message) {
        errorMessage = error.message;
    }
    throw new Error(errorMessage);
};

export async function ProjectData() {
    try {
        const response = await axios.get(`${routeURL}/project`);
        console.log('Fetched project data:', response.data);
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to load projects. Please ensure your backend server is running and the API endpoint is correct.');
    }
}

export async function ProjectDataById(id) {
    console.log('Fetching project data by ID:', id);
    try {
        const response = await axios.get(`${routeURL}/project/${id}`);
        console.log('Fetched project data by ID:', response.data);
        return response.data;
    } catch (error) {
        handleApiError(error, `Failed to load project with ID: ${id}.`);
    }
}

export async function NewProject(projectData) {
    try {
        const response = await axios.post(`${routeURL}/project/`, projectData);
        console.log("Project creation response:", response.data);
        return response.data;
    } catch (error) {
        handleApiError(error, "There was an error creating a project!");
    }
}

export async function ProjectUpdate(id, updatedProject) {
    try {
        const response = await axios.put(`${routeURL}/project/${id}`, updatedProject);
        console.log('Project updated successfully:', response.data);
        return response.data;
    } catch (error) {
        handleApiError(error, `Failed to update project with ID: ${id}.`);
    }
}

export async function addTeamMemberToProject(projectId, teamMemberId) {
    try {
        const response = await axios.put(`${routeURL}/project/${projectId}/team`, { teamMemberId });
        return response.data;
    } catch (error) {
        handleApiError(error, `Failed to add team member to project ${projectId}.`);
    }
}

export async function removeTeamMemberFromProject(projectId, teamMemberId) {
    try {
        const response = await axios.put(`${routeURL}/project/${projectId}/team/remove`, { teamMemberId });
        return response.data;
    } catch (error) {
        handleApiError(error, `Failed to remove team member from project ${projectId}.`);
    }
}

export async function deleteProject(id) {
    try {
        const response = await axios.delete(`${routeURL}/project/${id}`);
        console.log('Project deleted successfully:', response.data);
        return response.data;
    } catch (error) {
        handleApiError(error, `Failed to delete project with ID: ${id}.`);
    }
}