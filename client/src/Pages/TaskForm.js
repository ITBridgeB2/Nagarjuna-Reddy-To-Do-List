import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskForm = ({ onTaskAdded, editingTask, setEditingTask, setTasks }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert('Title is required');

    try {
      if (editingTask) {
        const res = await axios.put(`http://localhost:5000/tasks/${editingTask.id}`, {
          title,
          description,
        });
        setTasks(prev => prev.map(t => (t.id === editingTask.id ? res.data : t)));
        setSuccessMessage('Task updated successfully!');
        setEditingTask(null);
      } else {
        const response = await axios.post('http://localhost:5000/tasks', {
          title,
          description,
        });
        onTaskAdded(response.data);
        setSuccessMessage('Task added successfully!');
      }
      setTitle('');
      setDescription('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Error saving task');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>To-Do List</h2>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="button-group">
        <button type="submit">{editingTask ? 'Update Task' : 'Add Task'}</button>
        {editingTask && (
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setEditingTask(null);
              setTitle('');
              setDescription('');
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

     
    </form>
  );
};

export default TaskForm;