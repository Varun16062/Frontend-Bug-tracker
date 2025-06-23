import './App.css'
import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Main from './pages/Main'
import ProjectList from './pages/ProjectList'
import TicketList from './component/project/TicketList'
import ProtectRoute from './ProtectRoute'
import TicketDetailPage from './pages/TicketDetailPage'
import Navbar from './component/Navbar'
import TicketForm from './component/ticket/TicketForm'
import ProjectDetail from './component/project/ProjectDetail'
import ProjectSelector from './component/project/ProjectSelector'
import UpdateTicket from './component/ticket/UpdateTicket'
import CreateProject from './component/project/CreateProject'
import UpdateProject from './component/project/UpdateProject'
import AllTickets from './component/ticket/AllTickets'
import ProgressBoard from './component/ProgressBoard/ProgressBoard'
import TicketView from './component/ticket/TicketView'
import UserProfile from './component/UserProfile'
import AssignTicket from './component/ticket/AssignTicket'
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <div className="App">
      <div className="w-full">
        <Router>
          <Navbar />
          <div className="mb-10"></div>
          <ToastContainer />
          <Routes>
            <Route element={<ProtectRoute />}>
              <Route path='/' element={<Main />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path='/project' element={<ProjectList />} />
              <Route path='/project/create-Project' element={<CreateProject />} />
              <Route path='/project/update-Project/:projectId' element={<UpdateProject />} />
              <Route path='/project/:projectId' element={<ProjectDetail />} />
              <Route path='/project/selected' element={<ProjectSelector />} />

              <Route path='/ticket' element={<AllTickets />} />
              <Route path='/ticket/ticket-view/:ticketId' element={<TicketView />} />
              <Route path='/ticket/project-ticket/:projectId' element={<TicketList />} />
              <Route path='/ticket/update-ticket/:ticketId' element={<UpdateTicket />} />
              <Route path='/ticket/assign-ticket/:ticketId' element={<AssignTicket />} />
              <Route path='/ticket/addTicket' element={<TicketForm />} />
              <Route path='/ticket/ticketDetail/' element={<TicketDetailPage />} />

              <Route path='/progress-report' element={<ProgressBoard />} />
            </Route>

            <Route path='/signup' element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </div>
      <Analytics />
    </div>
  )
}

export default App