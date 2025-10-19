import { useState } from "react";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (title: string, description: string) => void;
  isDarkMode: boolean;
}

const ProjectModal = ({
  isOpen,
  onClose,
  onCreateProject,
  isDarkMode,
}: ProjectModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateProject(title.trim(), description.trim());
      setTitle("");
      setDescription("");
      onClose();
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-md mx-2 rounded-lg shadow-xl transform transition-all ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 md:p-6 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2
              className={`text-lg md:text-xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Create New Project
            </h2>
            <button
              onClick={handleClose}
              className={`p-1 rounded-md transition-colors ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6">
          <div className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Project Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="Enter project title..."
                required
                autoFocus
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                rows={3}
                placeholder="Enter project description (optional)..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className={`px-4 py-2 rounded-md transition-colors ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
