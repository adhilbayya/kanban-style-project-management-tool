import { useEffect, useState } from "react";
import type { CardType, ProjectType } from "./Card";
import axios from "axios";
import Column from "./Column";
import Sidebar from "./Sidebar";
import ProjectModal from "./ProjectModal";
import CardModal from "./CardModal";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import Card from "./Card";

interface ColumnType {
  todo: CardType[];
  "in-progress": CardType[];
  done: CardType[];
  [key: string]: CardType[];
}

interface BoardProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const Board = ({ isDarkMode, onToggleTheme }: BoardProps) => {
  const [columns, setColumns] = useState<ColumnType>({
    todo: [],
    "in-progress": [],
    done: [],
  });
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [showProjectModal, setShowProjectModal] = useState<boolean>(false);
  const [showCardModal, setShowCardModal] = useState<boolean>(false);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);

  // 🔹 Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<ProjectType[]>(
          "http://localhost:3000/cards/projects"
        );
        setProjects(response.data);
        setError(null);
      } catch (error) {
        setError("Failed to fetch projects. Make sure your server is running.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // 🔹 Select first project automatically
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0]._id);
    }
  }, [projects, selectedProjectId]);

  // 🔹 Fetch cards for selected project
  useEffect(() => {
    const fetchCards = async () => {
      if (!selectedProjectId) return;

      try {
        setIsLoading(true);
        const response = await axios.get<CardType[]>(
          `http://localhost:3000/cards/projects/${selectedProjectId}/cards`
        );
        const organisedData = organiseCardsByList(response.data);
        setColumns(organisedData);
        setError(null);
      } catch (error) {
        setError("Failed to fetch cards. Make sure your server is running.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [selectedProjectId]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const fromList = active.data.current?.fromList;
    if (!fromList) return;

    const card = columns[fromList].find((c) => c._id === active.id);
    if (card) setActiveCard(card);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null); // Hide overlay when dropped
    if (!over) return;

    const cardId = active.id as string;
    const fromList = active.data.current?.fromList as keyof ColumnType;
    const toList = over.id as keyof ColumnType;

    if (fromList === toList) return;

    const draggedCard = columns[fromList].find((card) => card._id === cardId);
    if (!draggedCard) return;

    setColumns((prevColumn) => {
      const fromCard = prevColumn[fromList].filter(
        (card) => card._id !== cardId
      );
      const toCard = [
        ...prevColumn[toList],
        { ...draggedCard, status: toList as CardType["status"] },
      ];
      return { ...prevColumn, [fromList]: fromCard, [toList]: toCard };
    });

    axios
      .put(
        `http://localhost:3000/cards/projects/${selectedProjectId}/cards/${cardId}`,
        { status: toList }
      )
      .then(() => {
        console.log(`Card ${cardId} moved to ${toList} successfully.`);
      })
      .catch((err) => {
        console.error("Failed to update card status:", err);
      });
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleCreateProject = async (title: string, description: string) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/cards/projects",
        { title, description }
      );
      setProjects([...projects, response.data]);
      setSelectedProjectId(response.data._id);
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Failed to create project. Please try again.");
    }
  };

  const handleCreateCard = async (title: string, description: string) => {
    if (!selectedProjectId) return;
    try {
      const { data: newCard } = await axios.post<CardType>(
        `http://localhost:3000/cards/projects/${selectedProjectId}/cards`,
        { title, description, status: "todo" }
      );
      setColumns((prev) => ({
        ...prev,
        todo: [...prev.todo, newCard],
      }));
    } catch (error) {
      console.error("Failed to create card:", error);
      alert("Failed to create card. Please try again.");
    }
  };

  const handleDeleteCard = async (cardId: string, fromList: string) => {
    if (!setSelectedProjectId) return;
    try {
      await axios.delete(
        `http://localhost:3000/cards/projects/${selectedProjectId}/cards/${cardId}`
      );
      setColumns((prevColumn) => ({
        ...prevColumn,
        [fromList]: prevColumn[fromList].filter((card) => card._id !== cardId),
      }));
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to delete card, Try again after some time");
    }
  };

  const selectedProject = projects.find((p) => p._id === selectedProjectId);

  if (isLoading) return <div className="text-center p-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 p-10">{error}</div>;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          projects={projects}
          selectedProjectId={selectedProjectId}
          onProjectSelect={handleProjectSelect}
          onCreateProject={() => setShowProjectModal(true)}
          isDarkMode={isDarkMode}
          onToggleTheme={onToggleTheme}
          isCollapsed={sidebarCollapsed}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col transition-all duration-300">
          {/* Header */}
          <div
            className={`p-3 md:p-4 border-b ${
              isDarkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className={`p-2 rounded-md transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <div>
                  <h1
                    className={`text-lg md:text-xl lg:text-2xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedProject
                      ? selectedProject.title
                      : "Project Management Tool"}
                  </h1>
                  {selectedProject?.description && (
                    <p
                      className={`text-xs md:text-sm mt-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {selectedProject.description}
                    </p>
                  )}
                </div>
              </div>
              {selectedProjectId && (
                <button
                  onClick={() => setShowCardModal(true)}
                  className={`px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded-md transition-colors ${
                    isDarkMode
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  + Add Card
                </button>
              )}
            </div>
          </div>

          {/* Columns */}
          <div className="flex-1 p-2 md:p-5 overflow-hidden">
            {projects.length === 0 ? (
              <div className="text-center p-10 text-gray-500">
                No projects found. Create your first project to get started!
              </div>
            ) : selectedProjectId ? (
              <div className="flex flex-col md:flex-row h-full gap-2 overflow-hidden">
                <Column
                  title="To Do"
                  id="todo"
                  cards={columns["todo"]}
                  isDarkMode={isDarkMode}
                  onDeleteCard={handleDeleteCard}
                />
                <Column
                  title="In Progress"
                  id="in-progress"
                  cards={columns["in-progress"]}
                  isDarkMode={isDarkMode}
                  onDeleteCard={handleDeleteCard}
                />
                <Column
                  title="Completed"
                  id="done"
                  cards={columns["done"]}
                  isDarkMode={isDarkMode}
                  onDeleteCard={handleDeleteCard}
                />
              </div>
            ) : (
              <div className="text-center p-10 text-gray-500">
                Please select a project to view its cards.
              </div>
            )}
          </div>
        </div>

        <DragOverlay>
          {activeCard ? (
            <Card card={activeCard} isDarkMode={isDarkMode} />
          ) : null}
        </DragOverlay>

        {/* Modals */}
        <ProjectModal
          isOpen={showProjectModal}
          onClose={() => setShowProjectModal(false)}
          onCreateProject={handleCreateProject}
          isDarkMode={isDarkMode}
        />
        <CardModal
          isOpen={showCardModal}
          onClose={() => setShowCardModal(false)}
          onCreateCard={handleCreateCard}
          isDarkMode={isDarkMode}
        />
      </div>
    </DndContext>
  );
};

const organiseCardsByList = (cards: CardType[]): ColumnType => {
  const columns: ColumnType = {
    todo: [],
    "in-progress": [],
    done: [],
  };
  cards.forEach((card) => {
    if (columns[card.status]) {
      columns[card.status].push(card);
    }
  });
  return columns;
};

export default Board;
