import React from 'react'
import TicketDetail from '../component/ticket/TicketDetail'

function TicketDetailPage() {

    const exampleTicket = {
        id: 'TKT-001',
        title: 'Implement User Login Feature',
        description: 'As a user, I want to be able to log in to the application securely using my credentials.',
        priority: 'High',
        status: 'In Progress',
        assignees: ['Alice Johnson', 'Bob Williams'],
        createdAt: '2023-05-10T10:00:00Z',
    };

    return (
        <div className='size-full p-8 flex flex-col justify-center align-middle'>
            <h1 className='mx-auto p-10'>Ticket Detail</h1>
            <TicketDetail ticket={exampleTicket} />
        </div>
    )
}

export default TicketDetailPage;