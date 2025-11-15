
import React from 'react';

interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick }) => {
  const baseClasses = "flex items-center justify-center w-full sm:w-auto text-sm font-medium py-3 px-4 sm:px-6 transition-colors duration-200 ease-in-out focus:outline-none";
  const activeClasses = "text-blue-400 border-b-2 border-blue-400";
  const inactiveClasses = "text-gray-400 hover:text-white border-b-2 border-transparent";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      {label}
    </button>
  );
};

export default TabButton;
