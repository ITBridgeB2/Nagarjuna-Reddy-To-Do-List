import React, { useState } from 'react';
import './App.css';
import TaskForm from './Pages/TaskForm';
import TaskList from './Pages/TaskList';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null); // ⬅️ Add this line

  return (
    <div className="container">
      <div className="todo-wrapper">
        {/* Left: Add/Edit Task Form */}
        <div className="task-form-card">
        <TaskForm
          onTaskAdded={(task) => {
            setTasks(prev => [...prev, task]); // only handle new tasks
          }}
          editingTask={editingTask}
          setEditingTask={setEditingTask}
          setTasks={setTasks}
        />
        </div>

        {/* Right: Task Table */}
        <div className="task-list-card">
          <TaskList
            tasks={tasks}
            setTasks={setTasks}
            onEditTask={setEditingTask} // ⬅️ Pass edit handler
          />
        </div>
      </div>

      
    </div>
  );
}

export default App;
