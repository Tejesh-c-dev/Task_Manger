import React, { useState } from 'react';

function TaskForm({ onAdd }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [showOptions, setShowOptions] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), priority);
      setText('');
      setPriority('medium');
      setShowOptions(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form-main">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          required
          maxLength={500}
        />
        <button type="submit" className="btn btn-primary">
          Add Task
        </button>
      </div>

      <div className="task-form-options">
        <button
          type="button"
          className="btn-link"
          onClick={() => setShowOptions(!showOptions)}
        >
          {showOptions ? 'Hide options' : 'More options'}
        </button>

        {showOptions && (
          <div className="task-form-extras">
            <div className="form-group-inline">
              <label htmlFor="priority">Priority:</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="priority-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
