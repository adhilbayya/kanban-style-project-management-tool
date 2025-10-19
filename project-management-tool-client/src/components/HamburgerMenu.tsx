interface HamburgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  isDarkMode: boolean;
}

const HamburgerMenu = ({
  isOpen,
  onToggle,
  isDarkMode,
}: HamburgerMenuProps) => {
  return (
    <button
      onClick={onToggle}
      className={`fixed top-4 left-4 z-50 p-2 rounded-md transition-colors ${
        isDarkMode
          ? "bg-gray-800 text-white hover:bg-gray-700"
          : "bg-white text-gray-700 hover:bg-gray-100"
      } shadow-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
    >
      <div className="w-6 h-6 flex flex-col justify-center items-center">
        <span
          className={`block h-0.5 w-6 transition-all duration-300 ${
            isDarkMode ? "bg-white" : "bg-gray-700"
          } ${isOpen ? "rotate-45 translate-y-1.5" : ""}`}
        />
        <span
          className={`block h-0.5 w-6 transition-all duration-300 mt-1 ${
            isDarkMode ? "bg-white" : "bg-gray-700"
          } ${isOpen ? "opacity-0" : ""}`}
        />
        <span
          className={`block h-0.5 w-6 transition-all duration-300 mt-1 ${
            isDarkMode ? "bg-white" : "bg-gray-700"
          } ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
        />
      </div>
    </button>
  );
};

export default HamburgerMenu;
