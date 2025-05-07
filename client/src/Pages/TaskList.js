import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = ({ tasks, setTasks, onEditTask }) => {
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [viewDescription, setViewDescription] = useState(null);  // Track the task to view description

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/tasks');
        setTasks(res.data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };
    fetchTasks();
  }, [setTasks]);

  const handleSelectTask = (id) => {
    setSelectedTaskIds(prev =>
      prev.includes(id) ? prev.filter(taskId => taskId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = tasks.map(task => task.id);
      setSelectedTaskIds(allIds);
    } else {
      setSelectedTaskIds([]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedTaskIds.map(id => axios.delete(`http://localhost:5000/tasks/${id}`))
      );
      setTasks(prev => prev.filter(task => !selectedTaskIds.includes(task.id)));
      setSelectedTaskIds([]);
    } catch (err) {
      console.error(err);
      alert('Error deleting selected tasks');
    }
  };

  const handleDeleteSingle = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting task');
    }
  };

  const handleComplete = async (id, task) => {
    try {
      const updated = { ...task, completed: !task.completed };
      const res = await axios.put(`http://localhost:5000/tasks/${id}`, updated);
      setTasks(tasks.map(t => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
      alert('Error updating task');
    }
  };

  // Handle the "View" button click to display description in a card
  const handleViewDescription = (task) => {
    setViewDescription(task);
  };

  return (
    <div className="task-table-wrapper">
      <div className="task-table-actions">
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={selectedTaskIds.length === tasks.length && tasks.length > 0}
        />
        <label>Select All</label>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedTaskIds.length === 0}
          style={{
            marginLeft: 10,
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: 5
          }}
        >
          Delete Selected
        </button>
        <button
          onClick={() => {
            tasks.forEach((task) => handleComplete(task.id, task));
          }}
          disabled={selectedTaskIds.length === 0}
          style={{
            marginLeft: 10,
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: 5
          }}
        >
          Mark All as Completed
        </button>
      </div>

      <div className="task-scrollable-table">
        <table className="task-table">
          <thead>
            <tr>
              <th></th>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id} className={task.completed ? 'completed' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedTaskIds.includes(task.id)}
                    onChange={() => handleSelectTask(task.id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{task.title}</td>
                <td>
                  <button
                    onClick={() => handleViewDescription(task)}
                    style={{ marginLeft: 10 }}
                  >
                    View
                  </button>
                </td>
                <td>{task.completed ? 'Completed' : 'Pending'}</td>
                <td style={{ textAlign: 'center' }}>
                  <button onClick={() => handleComplete(task.id, task)}>
                    {task.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button
                    onClick={() => onEditTask(task)}
                    style={{ marginLeft: 10 }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSingle(task.id)}
                    style={{ color: 'red', marginLeft: 10 }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show the description card when a task is selected for viewing */}
      {viewDescription && (
        <div className="description-card">
          <h3>Task Details</h3>
          <p><strong>Title:</strong> {viewDescription.title}</p>
          <p><strong>Description:</strong> {viewDescription.description}</p>
          <button onClick={() => setViewDescription(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
