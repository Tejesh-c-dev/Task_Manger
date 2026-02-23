import React, { useState } from 'react';

function TaskItem({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleToggle = () => {
    onUpdate(task._id, { completed: !task.completed });
  };

  const handleEdit = () => {
    if (isEditing && editText.trim()) {
      onUpdate(task._id, { text: editText.trim() });
    }
    setIsEditing(!isEditing);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    }
    if (e.key === 'Escape') {
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  const getPriorityClass = () => {
    switch (task.priority) {
      case 'high':
        return 'priority-high';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
      <input
        type="checkbox"
        className="task-checkbox"
        checked={task.completed}
        onChange={handleToggle}
      />

      <span className={`priority-badge ${getPriorityClass()}`}>
        {task.priority?.charAt(0).toUpperCase()}
      </span>
      
      {isEditing ? (
        <input
          type="text"
          className="edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyPress}
          autoFocus
          maxLength={500}
        />
      ) : (
        <span className="task-text">{task.text}</span>
      )}

      <div className="task-actions">
        <button 
          className="btn-edit" 
          onClick={handleEdit}
          title={isEditing ? 'Save' : 'Edit'}
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
        <button 
          className="btn-delete" 
          onClick={() => onDelete(task._id)}
          title="Delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
