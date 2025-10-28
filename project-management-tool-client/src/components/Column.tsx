import { useDroppable } from "@dnd-kit/core";
import type { CardType } from "./Card";
import Card from "./Card";

interface ColumnData {
  title: string;
  id: string;
  cards: CardType[];
  isDarkMode?: boolean;
  onDeleteCard: (cardId: string, fromList: string) => void;
}
const Column = ({
  title,
  id,
  cards,
  onDeleteCard,
  isDarkMode = false,
}: ColumnData) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`droppable-area flex flex-col w-full md:m-2 rounded transition-colors
        ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}
        ${isOver ? "drag-over" : ""}
        flex-1 h-full`}
    >
      <h2
        className={`text-center p-2 md:p-4 font-semibold border-b text-sm md:text-base ${
          isDarkMode
            ? "text-white border-gray-600"
            : "text-gray-900 border-gray-400"
        }`}
      >
        {title}
      </h2>
      <div className="p-1 md:p-2 space-y-1 md:space-y-2 overflow-y-auto h-full max-h-[300px] md:max-h-none">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            isDarkMode={isDarkMode}
            onDelete={() => onDeleteCard(card._id, id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
