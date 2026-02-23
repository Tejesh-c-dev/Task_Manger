import React, { useState, useEffect, useCallback } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Filter from '../components/Filter';
import Stats from '../components/Stats';
import { tasksAPI } from '../api/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });

  const { user } = useAuth();

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const [tasksRes, statsRes] = await Promise.all([
        tasksAPI.getAll(),
        tasksAPI.getStats(),
      ]);
      setTasks(tasksRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      const message = error.response?.data?.message || 'Error fetching tasks';
      toast.error(message);
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Add task
  const addTask = async (text, priority = 'medium', dueDate = null) => {
    try {
      const response = await tasksAPI.create({ text, priority, dueDate });
      setTasks([response.data.data, ...tasks]);
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        pending: prev.pending + 1,
      }));
      toast.success('Task added successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Error adding task';
      toast.error(message);
      console.error('Error adding task:', error);
    }
  };

  // Update task
  const updateTask = async (id, updates) => {
    try {
      // If toggling completion status
      if ('completed' in updates && Object.keys(updates).length === 1) {
        const response = await tasksAPI.toggle(id);
        const updatedTask = response.data.data;

        setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));

        // Update stats
        if (updatedTask.completed) {
          setStats((prev) => ({
            ...prev,
            completed: prev.completed + 1,
            pending: prev.pending - 1,
          }));
          toast.success('Task completed!');
        } else {
          setStats((prev) => ({
            ...prev,
            completed: prev.completed - 1,
            pending: prev.pending + 1,
          }));
        }
      } else {
        // General update
        const response = await tasksAPI.update(id, updates);
        setTasks(
          tasks.map((task) => (task._id === id ? response.data.data : task))
        );
        toast.success('Task updated');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error updating task';
      toast.error(message);
      console.error('Error updating task:', error);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      const taskToDelete = tasks.find((t) => t._id === id);
      await tasksAPI.delete(id);
      setTasks(tasks.filter((task) => task._id !== id));

      // Update stats
      setStats((prev) => ({
        ...prev,
        total: prev.total - 1,
        completed: taskToDelete.completed
          ? prev.completed - 1
          : prev.completed,
        pending: taskToDelete.completed ? prev.pending : prev.pending - 1,
      }));

      toast.success('Task deleted');
    } catch (error) {
      const message = error.response?.data?.message || 'Error deleting task';
      toast.error(message);
      console.error('Error deleting task:', error);
    }
  };

  // Delete all completed tasks
  const deleteCompleted = async () => {
    try {
      const response = await tasksAPI.deleteCompleted();
      const deletedCount = response.data.data.deletedCount;

      setTasks(tasks.filter((task) => !task.completed));
      setStats((prev) => ({
        ...prev,
        total: prev.total - deletedCount,
        completed: 0,
      }));

      toast.success(`${deletedCount} completed task(s) deleted`);
    } catch (error) {
      const message =
        error.response?.data?.message || 'Error deleting completed tasks';
      toast.error(message);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>My Tasks</h1>
        <p>Welcome back, {user?.name}!</p>
      </header>

      <TaskForm onAdd={addTask} />
      
      <div className="dashboard-controls">
        <Filter filter={filter} setFilter={setFilter} />
        {stats.completed > 0 && (
          <button className="btn btn-danger btn-sm" onClick={deleteCompleted}>
            Clear Completed ({stats.completed})
          </button>
        )}
      </div>

      <Stats tasks={tasks} stats={stats} />

      {loading ? (
        <div className="empty-state">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      ) : (
        <>
          <TaskList
            tasks={filteredTasks}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />

          {filteredTasks.length === 0 && (
            <div className="empty-state">
              {filter === 'all' ? (
                <p>No tasks yet! Add one above.</p>
              ) : (
                <p>No {filter} tasks found.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
