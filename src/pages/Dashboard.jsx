import React, { useEffect } from 'react';
import { ProjectData } from '../getData/ProjectData';
import { TicketData } from '../getData/TicketData';
import DashboardTicket from '../component/DashboardCompo/DashboardTicket';
import DashboardProjects from '../component/DashboardCompo/DashboardProjects';
import Sidebar from '../component/DashboardCompo/Sidebar';
import { Link } from 'react-router-dom';
import ProjectSelector from '../component/project/ProjectSelector';
import Breadcrumbs from '../component/Breadcrumbs';

function Dashboard() {

  const [projects, setProjects] = React.useState([])
  const [tickets, setTieckts] = React.useState([])

  useEffect(() => {
    ProjectData()
      .then((response) => {
        setProjects(response);
      })
      .catch((err) => {
        console.error('Error fetching projects:', err);
      });
  }, []);

  useEffect(() => {
    TicketData()
      .then((response) => {
        setTieckts(response);
      })
      .catch((err) => {
        console.error('Error fetching tickets:', err);
      });
  }, []);


  console.log('Projects data:', projects);
  console.log('Tickets data:', tickets);
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-pink-100">

      <div className="fixed h-screen md:w-50 bg-gray-400 shadow-md border-r border-gray-200">
        <Sidebar />
      </div>
      <main className="flex-1 ml-2 md:ml-50 p-8 pb-16 md:p-8 overflow-y-auto">
        <Breadcrumbs parentName="Dashboard" parentRoute="/" currentName="Overview" />
        <h1 className="text-4xl  text-center text-align: center; font-extrabold text-gray-900 text-underline-offser mb-8">Welcome To Dashboard</h1>
        <DashboardTicket ticket={tickets} />

        <DashboardProjects projects={projects} />

        <section className="mb-8 bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h6 className="text-1xl font-semibold text-green-400 mb-4">More Actions:</h6>
          <div className="flex flex-wrap gap-4">
            <Link to="/project/create-Project" className="bg-white-500 hover:bg-green-200 text-black font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md">
              Create New Project:
            </Link>
            <Link to="/ticket/addTicket" className="bg-white-500 hover:bg-yellow-200 text-black font-bold py-2 px-4  rounded-lg transition duration-200 shadow-md">
              Create New Ticket:
            </Link>
            <div className="bg-white-500 hover:bg--600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md">
              <ProjectSelector />
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}

export default Dashboard;