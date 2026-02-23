import React from 'react';

function Filter({ filter, setFilter }) {
  const filters = ['all', 'pending', 'completed'];

  return (
    <div className="filters">
      {filters.map(f => (
        <button
          key={f}
          className={`filter-btn ${filter === f ? 'active' : ''}`}
          onClick={() => setFilter(f)}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default Filter;
