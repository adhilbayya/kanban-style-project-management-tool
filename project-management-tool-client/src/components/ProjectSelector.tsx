import type { ProjectType } from "./Card";

interface ProjectSelectorProps {
  projects: ProjectType[];
  selectedProjectId: string | null;
  onProjectSelect: (projectId: string) => void;
  onCreateProject: () => void;
}

const ProjectSelector = ({
  projects,
  selectedProjectId,
  onProjectSelect,
  onCreateProject,
}: ProjectSelectorProps) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg mb-4">
      <h3 className="text-lg font-semibold">Select Project:</h3>
      <select
        value={selectedProjectId || ""}
        onChange={(e) => onProjectSelect(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Choose a project...</option>
        {projects.map((project) => (
          <option key={project._id} value={project._id}>
            {project.title}
          </option>
        ))}
      </select>
      <button
        onClick={onCreateProject}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Create New Project
      </button>
    </div>
  );
};

export default ProjectSelector;
