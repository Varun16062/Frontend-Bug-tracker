export const routeURL = 'http://localhost:5000'

export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }
    try {
        const parsedToken = JSON.parse(token);
        return {
            'Authorization': `bearer ${parsedToken}`
        };
    } catch (e) {
        console.error("Error parsing token from localStorage:", e);
        return null;
    }
};