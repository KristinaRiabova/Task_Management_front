import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskToEdit, setTaskToEdit] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'not completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3001/tasks');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Fetch tasks failed:', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await fetch(`http://localhost:3001/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleCompleted = async (id: number, isCompleted: boolean) => {
    try {
      await fetch(`http://localhost:3001/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted }),
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value as 'all' | 'completed' | 'not completed');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filter === 'all' || 
      (filter === 'completed' && task.isCompleted) || 
      (filter === 'not completed' && !task.isCompleted);

    const matchesSearchQuery = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearchQuery;
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container mx-auto mt-10 p-5 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-extralight text-center mb-5 text-400">Task Management</h1>
      <TaskForm fetchTasks={fetchTasks} taskToEdit={taskToEdit} onSaveEdit={setTaskToEdit} />

      <div className="flex mt-8 mb-4 justify-between items-center">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded p-2 flex-grow mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={filter}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded p-2 ml-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="not completed">Not completed</option>
        </select>
      </div>

      <TaskList tasks={filteredTasks} onDelete={deleteTask} onToggleCompleted={toggleCompleted} fetchTasks={fetchTasks} onEdit={setTaskToEdit} />
    </div>
  );
};

export default App;
