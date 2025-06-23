
import ProjectContent from '../project/ProjectContent';
import TicketDetail from '../ticket/TicketDetail'

function DashboardProjects({ projects }) {
    console.log("Projects in DashboardProjects:", projects);
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Projects:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (

                        <ProjectContent project={project}/>

                ))}
            </div>
        </section>
    )
}

export default DashboardProjects