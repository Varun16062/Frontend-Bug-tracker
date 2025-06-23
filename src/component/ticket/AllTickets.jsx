import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { TicketData, deleteTicket } from '../../getData/TicketData';
import { searchTickets } from '../../getData/SearchData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEye,faEdit,faTrashAlt,faSpinner,faPlus,faRedo,faSearch,faTicketAlt} from '@fortawesome/free-solid-svg-icons';
import debounce from 'lodash.debounce';

function AllTickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const fetchAllTickets = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await TicketData();
            setTickets(data || []);
        } catch (err) {
            console.error('Error fetching all tickets:', err);
            setError(err.message || 'Failed to load tickets. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    const performTicketSearch = useCallback(async (key) => {
        if (!key.trim()) {
            setIsSearching(false);
            fetchAllTickets();
            return;
        }

        setIsSearching(true);
        setLoading(true);
        setError(null);
        try {
            const result = await searchTickets(key);
            setTickets(result || []);
        } catch (err) {
            console.error('Error during ticket search:', err);
            setError(err.message || 'Failed to perform ticket search.');
            setTickets([]);
        } finally {
            setLoading(false);
        }
    }, [fetchAllTickets]);

    const debouncedTicketSearch = useCallback(
        debounce((key) => {
            performTicketSearch(key);
        }, 500),
        [performTicketSearch]
    );

    useEffect(() => {
        fetchAllTickets();
    }, [fetchAllTickets]);

    useEffect(() => {
        if (searchTerm) {
            debouncedTicketSearch(searchTerm);
        } else {
            if (isSearching) {
                fetchAllTickets();
            }
        }
        return () => {
            debouncedTicketSearch.cancel();
        };
    }, [searchTerm, debouncedTicketSearch, fetchAllTickets, isSearching]);


    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        performTicketSearch(searchTerm);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            setDeletingId(id);
            try {
                await deleteTicket(id);
                if (searchTerm) {
                    performTicketSearch(searchTerm);
                } else {
                    fetchAllTickets();
                }
            } catch (err) {
                console.error('Error deleting ticket:', err);
            } finally {
                setDeletingId(null);
            }
        }
    };

    if (loading) {
        return (
            <div className='container mx-auto p-4 mt-18 text-center'>
                <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-blue-500" />
                <p className="mt-2">{isSearching ? 'Searching tickets...' : 'Loading tickets...'}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='container mx-auto p-4 mt-18 text-center'>
                <p className="text-red-600 font-bold text-lg">Error: {error}</p>
                <button
                    onClick={searchTerm ? () => performTicketSearch(searchTerm) : fetchAllTickets}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    <FontAwesomeIcon icon={faRedo} className="mr-2" />
                    Retry {searchTerm ? 'Search' : 'Loading'} Tickets
                </button>
            </div>
        );
    }

    return (
        <div className='container mx-auto p-4 mt-18'>
            <div className="flex justify-between items-center mb-6">
                <h1 className='text-3xl font-extrabold text-gray-800 flex items-center'>
                   
                    All Tickets
                </h1>
                <Link to="/ticket/addTicket" className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Create New Ticket
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="mb-6 flex space-x-2">
                <input
                    type="text"
                    placeholder="Search by title, description, status, or priority..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <FontAwesomeIcon icon={faSearch} className="mr-2" /> Search
                </button>
            </form>

            {tickets.length === 0 && !loading ? (
                <div className='text-center bg-white p-12 rounded-lg shadow-md mt-10'>
                    {searchTerm ? (
                        <p className="text-xl text-gray-600 mb-6">
                            No tickets found matching "{searchTerm}".
                        </p>
                    ) : (
                        <>
                            <p className="text-xl text-gray-600 mb-6">
                                No tickets found. Looks like your ticket list is empty!
                            </p>
                            <Link to="/ticket/addTicket" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <FontAwesomeIcon icon={faPlus} className="mr-2" /> Create Your First Ticket
                            </Link>
                        </>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Priority
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Operations
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map(ticket => (
                                <tr key={ticket._id} className="hover:bg-gray-50">
                                    <td className="px-5 py-3 border-b border-gray-200 text-sm">
                                        {ticket.title}
                                    </td>
                                    <td className="px-5 py-3 border-b border-gray-200 text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ticket.status === 'To Do' ? 'bg-gray-200 text-gray-800' :
                                            ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                ticket.status === 'Done' ? 'bg-emerald-100 text-emerald-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 border-b border-gray-200 text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ticket.priority === 'High' ? 'bg-red-100 text-red-800' :
                                            ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                ticket.priority === 'Low' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800' // Default
                                            }`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 border-b border-gray-200 text-sm">
                                        {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-5 py-3 border-b border-gray-200 text-sm text-center">
                                        <Link to={`/ticket/ticket-view/${ticket._id}`} className="text-blue-600 hover:text-blue-800 mr-3">
                                            <FontAwesomeIcon icon={faEye} title="View Ticket" />
                                        </Link>
                                        <Link to={`/ticket/update-ticket/${ticket._id}`} className="text-green-600 hover:text-green-800 mr-3">
                                            <FontAwesomeIcon icon={faEdit} title="Edit Ticket" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(ticket._id)}
                                            className="text-red-600 hover:text-red-800"
                                            disabled={deletingId === ticket._id}
                                            title="Delete Ticket"
                                        >
                                            {deletingId === ticket._id ? (
                                                <FontAwesomeIcon icon={faSpinner} spin />
                                            ) : (
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AllTickets;