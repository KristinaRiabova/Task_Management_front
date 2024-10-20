import React from 'react';
import TaskItem from './TaskItem';

interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: number) => void;
  onToggleCompleted: (id: number, isCompleted: boolean) => void;
  fetchTasks: () => void;
  onEdit: (task: Task) => void; 
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onToggleCompleted, fetchTasks, onEdit }) => {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onDelete={onDelete} onToggleCompleted={onToggleCompleted} onEdit={onEdit} />
      ))}
    </ul>
  );
};

export default TaskList;
