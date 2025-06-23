import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TicketForm from '../component/ticket/TicketForm'
// import TicketList from './TicketList'
import Dashboard from './Dashboard';

function Main() {

    // const auth = localStorage.getItem("User");

    // const navigate = useNavigate();
    // const logout = () => {
    //     localStorage.clear();
    //     navigate("/signup")
    // }

    return (
        <div>
            {/* <h1 className="text-3xl font-bold underline">Hello, Its Bug Tracker(Jira) Application</h1>
            <br />
            <Link to="/project" className="text-blue-500 hover:underline">Projects</Link>
            <br />
            <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
            <br />
            <Link to="/signup" className="text-blue-500 hover:underline"><span className='user-login'>{JSON.parse(auth).email}</span> <small className='logout-btn' onClick={logout} >(Logout)</small></Link> */}

            <Dashboard />
            {/* <TicketForm />
            <br />
            <TicketList />
            <br /> */}
        </div>
    )
}

export default Main