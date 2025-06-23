import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TicketData, UpdateTicketStatus } from '../../getData/TicketData';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const getInitialColumns = () => ({
    'open': { name: 'Open', items: [] },
    'to_do': { name: 'To Do', items: [] },
    'in_progress': { name: 'In Progress', items: [] },
    'done': { name: 'Done', items: [] },
});

const KanbanBoard = () => {
    const [columns, setColumns] = useState(getInitialColumns());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAndOrganizeTickets = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedTickets = await TicketData();
                if (!fetchedTickets || !Array.isArray(fetchedTickets)) {
                    throw new Error("Received invalid ticket data from API.");
                }

                const newColumns = getInitialColumns();
                fetchedTickets.forEach(ticket => {
                    const statusKey = ticket.status.toLowerCase();
                    if (newColumns[statusKey]) {
                        newColumns[statusKey].items.push(ticket);
                    } else {
                        console.warn(`Ticket with ID ${ticket._id} has unknown status: ${ticket.status}. Placing in 'Open'.`);
                        newColumns['open'].items.push(ticket);
                    }
                });
                setColumns(newColumns);
            } catch (err) {
                console.error('Error fetching tickets for Kanban board:', err);
                setError(err.message || 'Failed to load tickets. Please try again.');
                toast.error(err.message || 'Failed to load tickets for the board.');
            } finally {
                setLoading(false);
            }
        };
        fetchAndOrganizeTickets();
    }, []);

    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;

        // 1. Dropped outside a droppable area or no change
        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
            return;
        }

        // Deep copy of columns to enable mutation for state update
        const newColumns = { ...columns };
        Object.keys(newColumns).forEach(key => {
            newColumns[key] = { ...newColumns[key], items: Array.from(newColumns[key].items) };
        });

        const startColumn = newColumns[source.droppableId];
        const endColumn = newColumns[destination.droppableId];

        const [draggedTicket] = startColumn.items.splice(source.index, 1);

        // Update the ticket's status in the local state immediately for responsiveness
        draggedTicket.status = destination.droppableId;
        endColumn.items.splice(destination.index, 0, draggedTicket);

        setColumns(newColumns); // Optimistic UI update

        // 2. Persist status change to the backend if columns are different
        if (source.droppableId !== destination.droppableId) {
            try {
                // Assuming UpdateTicketStatus expects ticket ID and new status (lowercase)
                await UpdateTicketStatus(draggableId, destination.droppableId);
                toast.success(`Ticket "${draggedTicket.title}" moved to ${endColumn.name}!`);
            } catch (err) {
                console.error('Error updating ticket status on backend:', err);
                toast.error(`Failed to update ticket status. Please refresh.`);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center text-blue-600">
                    <FontAwesomeIcon icon={faSpinner} spin size="3x" className="mb-4" />
                    <p className="text-lg">Loading tickets for Kanban board...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center text-red-600 bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                    <p className="text-xl font-semibold mb-4">Error Loading Tickets!</p>
                    <p className="mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                        Reload Board
                    </button>
                </div>
            </div>
        );
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex space-x-4 p-4 mt-8 justify-center overflow-x-auto">
                {Object.entries(columns).map(([columnId, column], index) => (
                    <Droppable droppableId={columnId} key={columnId || index}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`bg-gray-100 p-4 rounded-lg shadow-md w-80 flex-shrink-0 min-h-[400px] flex flex-col ${snapshot.isDraggingOver ? 'bg-blue-100 border-2 border-blue-400' : ''
                                    }`}
                            >
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                                    {column.name} ({column.items.length})
                                </h2>
                                {column.items.length === 0 && !snapshot.isDraggingOver && (
                                    <p className="text-gray-500 text-center italic mt-4">No tickets in this column.</p>
                                )}
                                {column.items.map((item, itemIndex) => (
                                    <Draggable key={item._id} draggableId={item._id} index={itemIndex}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`bg-white p-3 mb-3 rounded-md shadow-sm border border-gray-200 cursor-grab transition-all duration-200 ease-in-out
                                                    ${snapshot.isDragging ? 'border-blue-500 shadow-lg ring-2 ring-blue-300' : ''}
                                                    ${item.priority === 'High' ? 'border-l-4 border-red-500' : ''}
                                                    ${item.priority === 'Medium' ? 'border-l-4 border-yellow-500' : ''}
                                                    ${item.priority === 'Low' ? 'border-l-4 border-green-500' : ''}
                                                `}
                                            >
                                                <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                                                <p className="text-xs text-gray-500 mt-1">ID: {item._id.substring(0, 8)}...</p>
                                                <p className="text-sm text-gray-600">Priority: <span className={`font-semibold ${item.priority === 'High' ? 'text-red-700' :
                                                        item.priority === 'Medium' ? 'text-yellow-700' :
                                                            'text-green-700'
                                                    }`}>{item.priority}</span></p>
                                                <p className="text-sm text-gray-600">Assignee: {item.assignee?.name || 'N/A'}</p>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
            <div className="text-center p-4">
                <Link to={"/ticket/addTicket"}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center mx-auto"
                >
                    <FontAwesomeIcon icon={faPlusCircle} className="mr-2" /> Add New Ticket
                </Link>
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;