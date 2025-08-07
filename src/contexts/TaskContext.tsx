"use client";

import React, { createContext, useContext, useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useFolders } from '@/hooks/useFolders';
import type { Task, Folder } from '@/types';

interface TaskContextType {
  // Data
  tasks: Task[];
  folders: Folder[];
  
  // UI State
  editingTaskId: string | null;
  editText: string;
  editingFolderId: string | null;
  editFolderText: string;
  selectedFolder: string | null;
  expandedTasks: Set<string>;
  addingSubtaskTo: string | null;
  newSubtaskText: string;
  
  // Task Actions
  addTask: (task: Omit<Task, 'id'>) => string;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskComplete: (taskId: string) => void;
  addSubtask: (parentTaskId: string, text: string) => string | null;
  moveTaskToFolder: (taskId: string, folderId?: string) => void;
  setTaskDueDate: (taskId: string, date?: Date) => void;
  setTaskPriority: (taskId: string, priority?: "low" | "medium" | "high") => void;
  getSubtasks: (parentTaskId: string) => Task[];
  getFilteredTasks: (selectedFolder: string | null) => Task[];
  getTaskCountForFolder: (folderId?: string) => number;
  
  // Folder Actions
  addFolder: (name: string) => string;
  renameFolder: (folderId: string, name: string) => void;
  deleteFolder: (folderId: string) => void;
  
  // UI Actions
  startEditTask: (task: Task) => void;
  saveEditTask: (taskId: string) => void;
  cancelEditTask: () => void;
  setEditText: (text: string) => void;
  startEditFolder: (folder: Folder) => void;
  saveEditFolder: (folderId: string) => void;
  cancelEditFolder: () => void;
  setEditFolderText: (text: string) => void;
  setSelectedFolder: (folderId: string | null) => void;
  toggleExpanded: (taskId: string) => void;
  startAddSubtask: (taskId: string) => void;
  saveSubtask: (parentTaskId: string) => void;
  cancelAddSubtask: () => void;
  setNewSubtaskText: (text: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}

interface TaskProviderProps {
  children: React.ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  // Custom hooks for data management
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    addSubtask,
    moveTaskToFolder,
    setTaskDueDate,
    setTaskPriority,
    getSubtasks,
    getFilteredTasks,
    getTaskCountForFolder,
  } = useTasks();

  const {
    folders,
    addFolder,
    renameFolder,
    deleteFolder,
  } = useFolders();
  
  // UI state management
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editFolderText, setEditFolderText] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [addingSubtaskTo, setAddingSubtaskTo] = useState<string | null>(null);
  const [newSubtaskText, setNewSubtaskText] = useState("");

  // UI Actions
  const startEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditText(task.text);
  };

  const saveEditTask = (taskId: string) => {
    if (editText.trim() === "") return;
    updateTask(taskId, { text: editText });
    setEditingTaskId(null);
    setEditText("");
  };

  const cancelEditTask = () => {
    setEditingTaskId(null);
    setEditText("");
  };

  const startEditFolder = (folder: Folder) => {
    setEditingFolderId(folder.id);
    setEditFolderText(folder.name);
  };

  const saveEditFolder = (folderId: string) => {
    if (editFolderText.trim() === "") return;
    renameFolder(folderId, editFolderText);
    setEditingFolderId(null);
    setEditFolderText("");
  };

  const cancelEditFolder = () => {
    setEditingFolderId(null);
    setEditFolderText("");
  };

  const toggleExpanded = (taskId: string) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const startAddSubtask = (taskId: string) => {
    setAddingSubtaskTo(taskId);
  };

  const saveSubtask = (parentTaskId: string) => {
    if (newSubtaskText.trim() === "") return;
    addSubtask(parentTaskId, newSubtaskText);
    setNewSubtaskText("");
    setAddingSubtaskTo(null);
    setExpandedTasks(prev => new Set([...prev, parentTaskId]));
  };

  const cancelAddSubtask = () => {
    setAddingSubtaskTo(null);
    setNewSubtaskText("");
  };

  const handleDeleteFolder = (folderId: string) => {
    // Move tasks from deleted folder to no folder
    tasks.forEach((task) => {
      if (task.folderId === folderId) {
        moveTaskToFolder(task.id, undefined);
      }
    });
    deleteFolder(folderId);
    if (selectedFolder === folderId) {
      setSelectedFolder(null);
    }
  };

  const contextValue: TaskContextType = {
    // Data
    tasks,
    folders,
    
    // UI State
    editingTaskId,
    editText,
    editingFolderId,
    editFolderText,
    selectedFolder,
    expandedTasks,
    addingSubtaskTo,
    newSubtaskText,
    
    // Task Actions
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    addSubtask,
    moveTaskToFolder,
    setTaskDueDate,
    setTaskPriority,
    getSubtasks,
    getFilteredTasks,
    getTaskCountForFolder,
    
    // Folder Actions
    addFolder,
    renameFolder,
    deleteFolder: handleDeleteFolder,
    
    // UI Actions
    startEditTask,
    saveEditTask,
    cancelEditTask,
    setEditText,
    startEditFolder,
    saveEditFolder,
    cancelEditFolder,
    setEditFolderText,
    setSelectedFolder,
    toggleExpanded,
    startAddSubtask,
    saveSubtask,
    cancelAddSubtask,
    setNewSubtaskText,
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}