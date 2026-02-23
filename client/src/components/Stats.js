import React from 'react';

function Stats({ tasks = [], stats = null }) {
  // Use provided stats or calculate from tasks
  const total = stats?.total ?? tasks.length;
  const completed = stats?.completed ?? tasks.filter(t => t.completed).length;
  const pending = stats?.pending ?? (total - completed);
  const highPriority = stats?.highPriority ?? tasks.filter(t => t.priority === 'high' && !t.completed).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats">
      <div className="stat-item">
        <span className="stat-value">{total}</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat-item">
        <span className="stat-value stat-completed">{completed}</span>
        <span className="stat-label">Completed</span>
      </div>
      <div className="stat-item">
        <span className="stat-value stat-pending">{pending}</span>
        <span className="stat-label">Pending</span>
      </div>
      {highPriority > 0 && (
        <div className="stat-item">
          <span className="stat-value stat-high">{highPriority}</span>
          <span className="stat-label">High Priority</span>
        </div>
      )}
      <div className="stat-item">
        <span className="stat-value">{completionRate}%</span>
        <span className="stat-label">Done</span>
      </div>
    </div>
  );
}

export default Stats;
