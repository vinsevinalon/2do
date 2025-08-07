import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Task } from '@/types';

const LOCAL_STORAGE_KEY = "todoApp.tasks";

export function useTasks() {
  const [tasks, setTasks, isLoading, error] = useLocalStorage<Task[]>(LOCAL_STORAGE_KEY, []);

  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...task,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    return newTask.id;
  }, [setTasks]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  }, [setTasks]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prevTasks) => {
      // Get all subtask IDs that belong to this task (for cascade deletion)
      const subtaskIds = prevTasks
        .filter(task => task.parentTaskId === taskId)
        .map(task => task.id);
      
      // Remove the task and all its subtasks
      return prevTasks.filter(task => 
        task.id !== taskId && // Remove the main task
        !subtaskIds.includes(task.id) // Remove all subtasks
      );
    });
  }, [setTasks]);

  const toggleTaskComplete = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Check if this is a parent task (has subtasks)
    const hasSubtasks = tasks.some(t => t.parentTaskId === taskId);
    
    if (hasSubtasks) {
      // If marking parent as complete, mark all subtasks as complete too
      const newCompletedState = !task.completed;
      
      setTasks((prevTasks) =>
        prevTasks.map((t) => {
          // Update the main task
          if (t.id === taskId) {
            return { ...t, completed: newCompletedState };
          }
          // If marking parent as complete, mark all subtasks as complete too
          if (newCompletedState && t.parentTaskId === taskId) {
            return { ...t, completed: true };
          }
          return t;
        })
      );
    } else {
      // Regular completion toggle for subtasks or tasks without subtasks
      updateTask(taskId, { completed: !task.completed });
    }
  }, [tasks, setTasks, updateTask]);

  const addSubtask = useCallback((parentTaskId: string, text: string) => {
    const parentTask = tasks.find(task => task.id === parentTaskId);
    if (!parentTask) return null;
    
    const newSubtask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      parentTaskId: parentTaskId,
      folderId: parentTask.folderId, // Inherit folder from parent
    };
    
    setTasks((prevTasks) => [newSubtask, ...prevTasks]);
    return newSubtask.id;
  }, [tasks, setTasks]);

  const moveTaskToFolder = useCallback((taskId: string, folderId?: string) => {
    updateTask(taskId, { folderId });
  }, [updateTask]);

  const setTaskDueDate = useCallback((taskId: string, dueDate?: Date) => {
    updateTask(taskId, { dueDate });
  }, [updateTask]);

  const setTaskPriority = useCallback((taskId: string, priority?: "low" | "medium" | "high") => {
    updateTask(taskId, { priority });
  }, [updateTask]);

  // Memoized computed values
  const getSubtasks = useCallback((parentTaskId: string): Task[] => {
    return tasks.filter(task => task.parentTaskId === parentTaskId);
  }, [tasks]);

  const hasSubtasks = useCallback((taskId: string): boolean => {
    return tasks.some(task => task.parentTaskId === taskId);
  }, [tasks]);

  const getFilteredTasks = useCallback((selectedFolder: string | null): Task[] => {
    return selectedFolder
      ? tasks.filter(task => task.folderId === selectedFolder && !task.parentTaskId)
      : tasks.filter(task => !task.folderId && !task.parentTaskId);
  }, [tasks]);

  const getTaskCountForFolder = useCallback((folderId?: string): number => {
    return tasks.filter(task => 
      task.folderId === folderId && 
      !task.completed && 
      !task.parentTaskId // Exclude subtasks from count
    ).length;
  }, [tasks]);

  return {
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    addSubtask,
    moveTaskToFolder,
    setTaskDueDate,
    setTaskPriority,
    getSubtasks,
    hasSubtasks,
    getFilteredTasks,
    getTaskCountForFolder,
  };
}