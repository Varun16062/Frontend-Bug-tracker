import React from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
    return (
        <aside className="mt-8
        w-full md:w-50 bg-gray-800 text-white flex-shrink-0
        fixed bottom-0 left-0 right-0 z-20 md:static md:h-auto
        flex justify-around items-center md:flex-col md:justify-start md:items-stretch
        py-2 md:p-4 md:border-r md:space-y-2 border-gray-400">

            <nav className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-2 w-full justify-around md:justify-start">
                <Link to="/progress-report" className="block py-2 px-3 rounded-md text-sm  text-white-300 font-medium hover:bg-black
                -700 hover:underline transition-colors duration-200">
                    Progress report
                </Link>
                <Link to="/project" className="block py-2 px-3 rounded-md text-sm text-white-300 font-medium hover:bg-black
                -700 hover:underline transition-colors duration-200">
                    Projects
                </Link>
                <Link to="/Ticket" className="block py-2 px-3 rounded-md text-sm text-white-300 font-medium  hover:bg-black
                -700 hover:underline transition-colors duration-200">
                    Tickets
                </Link>
                <Link to='/profile/' className="block py-2 px-3 rounded-md text-sm  text-white-300 font-medium  hover:bg-black
                -700 hover:underline transition-colors duration-200">
                    My Profile
                </Link>
            </nav>
        </aside>
    )
}

export default Sidebar