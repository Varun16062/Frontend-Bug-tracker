import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faUserCircle, faUserTie, faEnvelope, faIdCard, faSignOutAlt, faExclamationTriangle, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { UserDataById } from '../getData/UserData';

const UserProfile = () => {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loggedInUserString = localStorage.getItem('User');
    const loggedInUser = loggedInUserString ? JSON.parse(loggedInUserString) : null;
    const userId = loggedInUser?._id;

    const fetchUserProfile = useCallback(async () => {
        if (!userId) {
            setError('No user logged in. Please log in to view your profile.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await UserDataById(userId);
            if (data) {
                setUserProfile(data);
                toast.success('User profile loaded!');
            } else {
                setError('User data not found.');
                toast.error('User profile data could not be retrieved.');
            }
        } catch (err) {
            console.error('Error fetching user profile:', err);
            setError(err.message || 'Failed to load user profile. Please try again.');
            toast.error(err.message || 'Failed to load user profile!');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('User');
        toast.info('You have been logged out.');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
                <div className="text-center text-blue-600">
                    <FontAwesomeIcon icon={faSpinner} spin size="3x" className="mb-4" />
                    <p className="text-lg">Loading user profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
                <div className="text-center text-red-600 bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                    <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="text-red-500 mb-4" />
                    <p className="text-xl font-semibold mb-4">Error!</p>
                    <p className="mb-4">{error}</p>

                    {!userId ? (
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center mx-auto"
                        >
                            <FontAwesomeIcon icon={faSignInAlt} className="mr-2" /> Go to Login
                        </button>
                    ) : (
                        <button
                            onClick={fetchUserProfile}
                            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center mx-auto"
                        >
                            <FontAwesomeIcon icon={faSpinner} spin={loading} className="mr-2" /> Retry Loading
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
                <div className="text-center text-gray-700 bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                    <p className="text-xl font-semibold mb-4">No User Profile</p>
                    <p>It seems you are not logged in or your profile could not be found.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
                    >
                        <FontAwesomeIcon icon={faSignInAlt} className="mr-2" /> Login Now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-xl w-full">
                <h1 className="text-2xl font-extrabold text-blue-500 mb-8 text-center flex items-center justify-center">
                    <FontAwesomeIcon icon={faUserCircle} className="mr-4 text-slate-400" />
                    Profile Info
                </h1>

                <div className="space-y-6">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1 flex items-center">
                            <FontAwesomeIcon icon={faUserCircle} className="mr-2 text-blue-400" />Name:
                        </p>
                        <p className="text-2xl font-bold text-gray-800">{userProfile.username}</p>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1 flex items-center">
                            <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-blue-400" />Email:
                        </p>
                        <p className="text-lg text-gray-700">{userProfile.email}</p>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1 flex items-center">
                            <FontAwesomeIcon icon={faUserTie} className="mr-2 text-blue-400" />Roll:
                        </p>
                        <p className="text-lg text-gray-700">{userProfile.role}</p>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1 flex items-center">
                            <FontAwesomeIcon icon={faIdCard} className="mr-2 text-blue-400" />User ID:
                        </p>
                        <p className="text-sm text-gray-600 font-mono break-all">{userProfile._id}</p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="w-full flex justify-center items-center py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;