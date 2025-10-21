import axios from "axios";
import type { ProjectType } from "./Card";
import { DeleteOutline } from "@mui/icons-material";

interface SidebarProps {
  projects: ProjectType[];
  selectedProjectId: string | null;
  onProjectSelect: (projectId: string) => void;
  onCreateProject: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isCollapsed: boolean;
  projectsData: React.Dispatch<React.SetStateAction<ProjectType[]>>;
}

const Sidebar = ({
  projects,
  selectedProjectId,
  onProjectSelect,
  onCreateProject,
  isDarkMode,
  onToggleTheme,
  isCollapsed,
  projectsData,
}: SidebarProps) => {
  const selectedProject = projects.find((p) => p._id === selectedProjectId);

  const handleDelete = async (projectId: string) => {
    try {
      axios.delete(`http://localhost:3000/cards/projects/${projectId}`);
      projectsData((prevProjects) => {
        return prevProjects.filter((p) => p._id !== projectId);
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`h-full transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-12 md:w-16" : "w-64 md:w-80"
      } ${isDarkMode ? "bg-gray-900" : "bg-white"} border-r ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      } flex flex-col`}
    >
      {/* Header */}
      <div
        className={`p-2 md:p-4 border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <h2
              className={`text-sm md:text-lg font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Project Manager
            </h2>
            <button
              onClick={onToggleTheme}
              className={`p-1 md:p-1.5 rounded-md transition-colors ${
                isDarkMode
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              <span className="text-xs md:text-sm">
                {isDarkMode ? "🌙" : "☀️"}
              </span>
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs md:text-sm">
                PM
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Current Project Section */}
      <div className="flex-1 p-2 md:p-4">
        {!isCollapsed ? (
          <>
            <div className="mb-4 md:mb-6">
              <h3
                className={`text-xs md:text-sm font-semibold uppercase tracking-wide mb-2 md:mb-3 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Current Project
              </h3>
              {selectedProject ? (
                <div
                  className={`p-2 md:p-3 rounded-lg ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-100"
                  }`}
                >
                  <h4
                    className={`text-sm md:text-base font-medium ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedProject.title}
                  </h4>
                  {selectedProject.description && (
                    <p
                      className={`text-xs md:text-sm mt-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {selectedProject.description}
                    </p>
                  )}
                </div>
              ) : (
                <div
                  className={`p-3 rounded-lg text-center ${
                    isDarkMode
                      ? "bg-gray-800 text-gray-400"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  No project selected
                </div>
              )}
            </div>

            {/* All Projects Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3
                  className={`text-sm font-semibold uppercase tracking-wide ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  All Projects
                </h3>
                <button
                  onClick={onCreateProject}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    isDarkMode
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  + New
                </button>
              </div>

              <div className="space-y-1 max-h-64 overflow-y-auto">
                {projects.length === 0 ? (
                  <div
                    className={`p-3 rounded-lg text-center text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    No projects yet
                  </div>
                ) : (
                  projects.map((project) => (
                    <button
                      key={project._id}
                      onClick={() => onProjectSelect(project._id)}
                      className={`flex justify-between w-full text-left p-3 rounded-lg transition-colors ${
                        selectedProjectId === project._id
                          ? isDarkMode
                            ? "bg-blue-600 text-white"
                            : "bg-blue-500 text-white"
                          : isDarkMode
                          ? "hover:bg-gray-800 text-gray-300"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div>
                        <div className="font-medium">{project.title}</div>
                        {project.description && (
                          <div
                            className={`text-xs mt-1 ${
                              selectedProjectId === project._id
                                ? "text-blue-100"
                                : isDarkMode
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            {project.description}
                          </div>
                        )}
                      </div>
                      <div onClick={() => handleDelete(project._id)}>
                        <DeleteOutline />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          /* Collapsed view - show only project icons */
          <div className="space-y-2">
            <button
              onClick={onCreateProject}
              className={`w-full flex items-center justify-center p-2 rounded-md transition-colors ${
                isDarkMode
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              title="Create New Project"
            >
              <span className="text-xl">+</span>
            </button>
            {projects.map((project) => (
              <button
                key={project._id}
                onClick={() => onProjectSelect(project._id)}
                className={`w-full flex items-center justify-center p-2 rounded-md transition-colors ${
                  selectedProjectId === project._id
                    ? isDarkMode
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white"
                    : isDarkMode
                    ? "hover:bg-gray-800 text-gray-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                title={project.title}
              >
                <span className="text-sm font-bold">
                  {project.title.charAt(0).toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div
          className={`p-4 border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div
            className={`text-xs text-center ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Project Management Tool
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
