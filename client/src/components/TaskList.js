import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onUpdate, onDelete }) {
  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task._id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TaskList;
