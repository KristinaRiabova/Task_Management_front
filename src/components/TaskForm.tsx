import React, { useState, useEffect } from "react";

interface Task {
  id?: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

interface TaskFormProps {
  fetchTasks: () => void;
  taskToEdit?: Task;
  onSaveEdit: (task: Task | null) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  fetchTasks,
  taskToEdit,
  onSaveEdit,
}) => {
  const [title, setTitle] = useState<string>(
    taskToEdit ? taskToEdit.title : ""
  );
  const [description, setDescription] = useState<string>(
    taskToEdit ? taskToEdit.description : ""
  );
  const [isCompleted, setIsCompleted] = useState<boolean>(
    taskToEdit ? taskToEdit.isCompleted : false
  );
  const [emoji, setEmoji] = useState<string>("📝");

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setIsCompleted(taskToEdit.isCompleted);
      setEmoji(taskToEdit.title.split(" ")[0]);
    }
  }, [taskToEdit]);

  const handleUpdate = async () => {
    const updatedTask: Task = {
      id: taskToEdit?.id,
      title, 
      description,
      isCompleted,
    };

    try {
      if (taskToEdit) {
        await fetch(`http://localhost:3001/tasks/${taskToEdit.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTask),
        });
        fetchTasks();
        resetForm(); 
      }
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: Task = {
      title: `${emoji} ${title}`, 
      description,
      isCompleted,
    };

    try {
      await fetch("http://localhost:3001/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      resetForm(); 
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setIsCompleted(false);
    setEmoji("📝");
    onSaveEdit(null);
  };

  return (
    <form
      onSubmit={
        taskToEdit
          ? (e) => {
              e.preventDefault();
              handleUpdate();
            }
          : handleSubmit
      }
      className="bg-white shadow-md p-4 rounded"
    >
      <h2 className="text-xl font-extralight text-gray-800 mb-2">
        {taskToEdit ? "Edit Task" : "Create Task"}
      </h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)} 
        required
        className="w-full p-2 mb-2 border rounded"
        readOnly={!!taskToEdit && !taskToEdit.id} 
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <div className="flex items-center mb-2">
        <label className="mr-2">Status:</label>
        <select
          value={isCompleted ? "completed" : "not completed"}
          onChange={(e) => setIsCompleted(e.target.value === "completed")}
          className="border rounded p-2"
        >
          <option value="Not-completed">Not completed</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      

      {!taskToEdit && (
        <div className="flex space-x-1 mb-4">
        {["📝", "🎯", "🔥", "🚀", "✅", "🌟", "💡", "⚡", "📅", "🎉", "🐱‍👤", "💻"].map((e) => (
            <button
              type="button"
              key={e}
              onClick={() => setEmoji(e)}
              className={`p-1 border rounded hover:bg-gray-100 text-lg ${
                emoji === e ? "bg-blue-100" : ""
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      )}

      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          {taskToEdit ? "Update Task" : "Add Task"}
        </button>

        {taskToEdit && (
          <button
            type="button"
            onClick={resetForm}
            className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-200 transition duration-200"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
