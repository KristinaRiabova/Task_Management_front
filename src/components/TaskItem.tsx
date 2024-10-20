import React, { useState } from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

interface TaskItemProps {
  task: Task;
  onDelete: (id: number) => void;
  onToggleCompleted: (id: number, isCompleted: boolean) => void;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onToggleCompleted, onEdit }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleEdit = () => {
    onEdit(task);
    toggleMenu();
  };

  const handleDelete = () => {
    onDelete(task.id);
    toggleMenu();
  };

  const handleToggleCompleted = () => {
    onToggleCompleted(task.id, !task.isCompleted);
    toggleMenu();
  };

  return (
    <li className="bg-white shadow-md p-4 mb-4 rounded border relative">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <button
          onClick={toggleMenu}
          className="text-gray-500 hover:text-gray-600"
        >
          •••
        </button>
      </div>
      {isMenuOpen && (
        <div className="absolute right-0 mt-1 w-32 bg-white border rounded shadow-lg z-10">
          <button onClick={handleToggleCompleted} className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100">
            {task.isCompleted ? 'Not completed' : 'Completed'}
          </button>
          <button onClick={handleEdit} className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100">
            Edit
          </button>
          <button onClick={handleDelete} className="block w-full text-left px-2 py-1 text-sm text-red-500 hover:bg-red-100">
            Delete
          </button>
        </div>
      )}
      <p className="text-gray-600 mt-1">{task.description}</p>
      <div className="flex justify-between items-center mt-3">
        <span className={`inline-block px-3 py-1 text-sm rounded-full ${task.isCompleted ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {task.isCompleted ? 'Completed' : 'Not completed'}
        </span>
      </div>
    </li>
  );
};

export default TaskItem;
