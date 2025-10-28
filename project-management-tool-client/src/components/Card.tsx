import { useDraggable } from "@dnd-kit/core";
import { DeleteOutline } from "@mui/icons-material";

export interface CardType {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  projectId: string;
  userId: string;
}

export interface ProjectType {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
  userId: string;
}

const Card = ({
  card,
  isDarkMode = false,
  onDelete,
}: {
  card: CardType;
  isDarkMode?: boolean;
  onDelete?: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card._id,
    data: { fromList: card.status },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`p-2 md:p-3 border rounded-lg cursor-move transition-colors ${
        isDarkMode
          ? "bg-gray-800 border-gray-600 hover:bg-gray-700"
          : "bg-white border-gray-300 hover:bg-gray-50"
      } shadow-md hover:shadow-lg border-l-5 ${
        card.status === "in-progress"
          ? "border-l-yellow-400"
          : card.status === "done"
          ? "border-l-green-400"
          : "border-l-red-400"
      }`}
    >
      <h4
        className={`flex justify-between text-xs md:text-sm font-bold ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {card.title}{" "}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <DeleteOutline />
        </button>
      </h4>
      {card.description && (
        <p
          className={`text-xs mt-1 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {card.description}
        </p>
      )}
    </div>
  );
};

export default Card;
