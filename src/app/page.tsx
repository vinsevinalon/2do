"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { X, CalendarIcon, Edit3, Save, Tag, AlertCircle, Info, CheckCircle, Folder, FolderPlus } from "lucide-react";
import { format } from "date-fns";

// Task interface - defines the structure of a task object
interface Task {
  id: string; // Unique identifier for each task
  text: string; // The task description/content
  completed: boolean; // Whether the task is completed or not
  dueDate?: Date; // Optional due date for the task
  priority?: "low" | "medium" | "high"; // Optional priority level
  folderId?: string; // Optional folder ID to organize tasks into folders
}

// Folder interface - defines the structure of a folder object
interface Folder {
  id: string; // Unique identifier for each folder
  name: string; // Display name of the folder
  color?: string; // Optional color for visual distinction (hex color code)
}

// Local storage keys for persisting data
const LOCAL_STORAGE_KEY = "todoApp.tasks"; // Key for storing tasks in localStorage
const FOLDERS_STORAGE_KEY = "todoApp.folders"; // Key for storing folders in localStorage

export default function HomePage() {
  // Core state management for tasks and folders
  const [tasks, setTasks] = useState<Task[]>([]); // Array of all tasks
  const [folders, setFolders] = useState<Folder[]>([]); // Array of all folders
  
  // Task creation and editing state
  const [newTaskText, setNewTaskText] = useState(""); // Text input for creating new tasks
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null); // ID of task currently being edited
  const [editText, setEditText] = useState(""); // Text content when editing a task
  
  // Folder management state
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null); // ID of folder currently being edited
  const [editFolderText, setEditFolderText] = useState(""); // Text content when editing a folder name
  const [newFolderText, setNewFolderText] = useState(""); // Text input for creating new folders
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null); // Currently selected folder for filtering tasks
  const [showNewFolderInput, setShowNewFolderInput] = useState(false); // Toggle for showing/hiding new folder input

  // Effect hook to load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTasks) {
      // Parse stored tasks and convert dueDate strings back to Date objects
      const parsedTasks = JSON.parse(storedTasks).map((task: Task) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));
      setTasks(parsedTasks);
    }
  }, []);

  // Effect hook to load folders from localStorage on component mount
  useEffect(() => {
    const storedFolders = localStorage.getItem(FOLDERS_STORAGE_KEY);
    if (storedFolders) {
      setFolders(JSON.parse(storedFolders));
    }
  }, []);

  // Effect hook to save tasks to localStorage whenever tasks array changes
  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem(LOCAL_STORAGE_KEY)) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  // Effect hook to save folders to localStorage whenever folders array changes
  useEffect(() => {
    if (folders.length > 0 || localStorage.getItem(FOLDERS_STORAGE_KEY)) {
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
    }
  }, [folders]);

  /**
   * Handler for adding a new task
   * Creates a task object with unique ID and assigns it to the currently selected folder
   */
  const handleAddTask = () => {
    if (newTaskText.trim() === "") return; // Prevent adding empty tasks
    const newTask: Task = {
      id: crypto.randomUUID(), // Generate unique identifier
      text: newTaskText,
      completed: false,
      folderId: selectedFolder || undefined, // Assign to selected folder or no folder
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]); // Add to beginning of tasks array
    setNewTaskText(""); // Clear input field
  };

  /**
   * Handler for toggling task completion status
   * Updates the completed property of the specified task
   */
  const handleToggleComplete = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  /**
   * Handler for deleting a task
   * Removes the task from the tasks array using filter
   */
  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  /**
   * Handler for starting task edit mode
   * Sets the editing state and populates the edit text field
   */
  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditText(task.text);
  };

  /**
   * Handler for saving task edits
   * Updates the task text and exits edit mode
   */
  const handleSaveEdit = (taskId: string) => {
    if (editText.trim() === "") return; // Prevent saving empty tasks
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, text: editText } : task
      )
    );
    setEditingTaskId(null); // Exit edit mode
    setEditText(""); // Clear edit text
  };

  /**
   * Handler for canceling task edit
   * Exits edit mode without saving changes
   */
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditText("");
  };

  /**
   * Handler for setting or clearing task due date
   * Updates the dueDate property of the specified task
   */
  const handleSetDueDate = (taskId: string, date?: Date) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, dueDate: date } : task
      )
    );
  };

  /**
   * Handler for setting or clearing task priority
   * Updates the priority property of the specified task
   */

  /**
   * Handler for setting or clearing task priority
   * Updates the priority property of the specified task
   */
  const handleSetPriority = (
    taskId: string,
    priority?: "low" | "medium" | "high"
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, priority: priority } : task
      )
    );
  };

  /**
   * Handler for adding a new folder
   * Creates a folder object with unique ID and random color
   */
  const handleAddFolder = () => {
    if (newFolderText.trim() === "") return; // Prevent adding empty folders
    const newFolder: Folder = {
      id: crypto.randomUUID(), // Generate unique identifier
      name: newFolderText,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Generate random hex color
    };
    setFolders((prevFolders) => [...prevFolders, newFolder]); // Add to folders array
    setNewFolderText(""); // Clear input field
    setShowNewFolderInput(false); // Hide input field
  };

  /**
   * Handler for deleting a folder
   * Removes folder and moves its tasks to "no folder" state
   */
  const handleDeleteFolder = (folderId: string) => {
    // Move tasks from deleted folder to no folder (removes folderId)
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.folderId === folderId ? { ...task, folderId: undefined } : task
      )
    );
    setFolders((prevFolders) => prevFolders.filter((folder) => folder.id !== folderId));
    // If deleted folder was selected, reset selection
    if (selectedFolder === folderId) {
      setSelectedFolder(null);
    }
  };

  /**
   * Handler for starting folder edit mode
   * Sets the editing state and populates the edit text field
   */
  const handleStartEditFolder = (folder: Folder) => {
    setEditingFolderId(folder.id);
    setEditFolderText(folder.name);
  };

  /**
   * Handler for saving folder edits
   * Updates the folder name and exits edit mode
   */
  const handleSaveEditFolder = (folderId: string) => {
    if (editFolderText.trim() === "") return; // Prevent saving empty folder names
    setFolders((prevFolders) =>
      prevFolders.map((folder) =>
        folder.id === folderId ? { ...folder, name: editFolderText } : folder
      )
    );
    setEditingFolderId(null); // Exit edit mode
    setEditFolderText(""); // Clear edit text
  };

  /**
   * Handler for canceling folder edit
   * Exits edit mode without saving changes
   */
  const handleCancelEditFolder = () => {
    setEditingFolderId(null);
    setEditFolderText("");
  };

  /**
   * Handler for moving a task to a different folder
   * Updates the folderId property of the specified task
   */
  const handleMoveTaskToFolder = (taskId: string, folderId?: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, folderId: folderId } : task
      )
    );
  };

  /**
   * Helper function to get the appropriate icon for task priority levels
   * Returns different colored icons based on priority (high=red, medium=yellow, low=green)
   */
  const getPriorityIcon = (priority?: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <Info className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Tag className="h-4 w-4 text-slate-500" />;
    }
  };

  /**
   * Filter tasks based on selected folder
   * If a folder is selected, show only tasks in that folder
   * If no folder is selected, show only tasks that don't belong to any folder
   */
  const filteredTasks = selectedFolder
    ? tasks.filter(task => task.folderId === selectedFolder)
    : tasks.filter(task => !task.folderId); // Show tasks without folders when no folder is selected

  /**
   * Helper function to count incomplete tasks in a specific folder
   * Used for displaying task counts in folder list
   */
  const getTaskCountForFolder = (folderId?: string) => {
    return tasks.filter(task => task.folderId === folderId && !task.completed).length;
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-3 sm:p-6 md:p-10 lg:p-14 xl:p-28 bg-gradient-to-br from-slate-950 to-slate-800 text-slate-50">
      {/* Main container with responsive layout - stacked on mobile, side-by-side on desktop */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-4 lg:gap-6">
        
        {/* Folder Sidebar - full width on mobile, fixed width on desktop */}
        <Card className="w-full lg:w-80 bg-slate-900/80 border-slate-700 shadow-2xl backdrop-blur-sm h-fit order-2 lg:order-1">
          <CardHeader className="border-b border-slate-700 pb-3 lg:pb-4">
            <CardTitle className="text-lg lg:text-xl font-bold text-slate-100 flex items-center gap-2">
              <Folder className="h-4 w-4 lg:h-5 lg:w-5" />
              Folders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 lg:p-4">
            {/* All Tasks (no folder) option */}
            <div
              className={`flex items-center justify-between p-2 lg:p-3 rounded-lg cursor-pointer transition-all mb-2 ${
                selectedFolder === null
                  ? "bg-sky-600/20 border border-sky-600/50"
                  : "hover:bg-slate-800 border border-transparent"
              }`}
              onClick={() => setSelectedFolder(null)}
            >
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                <span className="text-sm lg:text-base text-slate-100">All Tasks</span>
              </div>
              <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
                {getTaskCountForFolder(undefined)}
              </span>
            </div>

            {/* Folder List */}
            <div className="space-y-2 mb-3 lg:mb-4">
              {folders.map((folder) => (
                <div key={folder.id} className="group">
                  {editingFolderId === folder.id ? (
                    /* Folder Edit Mode */
                    <div className="flex items-center gap-2 p-2 bg-slate-800 rounded-lg">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: folder.color }}
                      ></div>
                      <Input
                        type="text"
                        value={editFolderText}
                        onChange={(e) => setEditFolderText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleSaveEditFolder(folder.id);
                          if (e.key === "Escape") handleCancelEditFolder();
                        }}
                        className="flex-1 h-7 text-sm bg-slate-700 border-slate-600"
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-green-500 hover:text-green-400"
                        onClick={() => handleSaveEditFolder(folder.id)}
                      >
                        <Save size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-slate-300"
                        onClick={handleCancelEditFolder}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  ) : (
                    /* Folder Display Mode */
                    <div
                      className={`flex items-center justify-between p-2 lg:p-3 rounded-lg cursor-pointer transition-all ${
                        selectedFolder === folder.id
                          ? "bg-sky-600/20 border border-sky-600/50"
                          : "hover:bg-slate-800 border border-transparent"
                      }`}
                      onClick={() => setSelectedFolder(folder.id)}
                    >
                      <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: folder.color }}
                        ></div>
                        <span className="text-sm lg:text-base text-slate-100 truncate" title={folder.name}>
                          {folder.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded mr-1">
                          {getTaskCountForFolder(folder.id)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-slate-400 hover:text-sky-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEditFolder(folder);
                          }}
                        >
                          <Edit3 size={12} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-slate-400 hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFolder(folder.id);
                          }}
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Folder Section */}
            {showNewFolderInput ? (
              <div className="flex items-center gap-2 p-2 bg-slate-800 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-slate-500 flex-shrink-0"></div>
                <Input
                  type="text"
                  placeholder="Folder name..."
                  value={newFolderText}
                  onChange={(e) => setNewFolderText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleAddFolder();
                    if (e.key === "Escape") {
                      setShowNewFolderInput(false);
                      setNewFolderText("");
                    }
                  }}
                  className="flex-1 h-7 text-sm bg-slate-700 border-slate-600"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-green-500 hover:text-green-400"
                  onClick={handleAddFolder}
                >
                  <Save size={12} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-400 hover:text-slate-300"
                  onClick={() => {
                    setShowNewFolderInput(false);
                    setNewFolderText("");
                  }}
                >
                  <X size={12} />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full border-slate-700 text-slate-400 hover:text-slate-100 hover:bg-slate-800 text-sm"
                onClick={() => setShowNewFolderInput(true)}
              >
                <FolderPlus size={14} className="mr-2" />
                Add Folder
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Main Tasks Panel - full width on mobile, flexible on desktop */}
        <Card className="flex-1 bg-slate-900/80 border-slate-700 shadow-2xl backdrop-blur-sm order-1 lg:order-2">
          <CardHeader className="border-b border-slate-700 pb-4 lg:pb-6">
            <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 mb-2">
              2do List 
            </CardTitle>
            <CardDescription className="text-center text-slate-400 text-sm lg:text-base px-2">
              {selectedFolder 
                ? `Tasks in "${folders.find(f => f.id === selectedFolder)?.name || 'Unknown Folder'}"`
                : "All tasks without folders"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 lg:p-8">
            {/* Task Input Section */}
            <div className="flex flex-col sm:flex-row w-full items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-6 lg:mb-10">
              <Input
                type="text"
                placeholder={`Add a new task${selectedFolder ? ` to ${folders.find(f => f.id === selectedFolder)?.name}` : ''}...`}
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddTask();
                  }
                }}
                className="flex-1 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-sky-500 focus:border-sky-500 rounded-md h-11 lg:h-12 text-sm lg:text-base px-3 lg:px-4"
              />
              <Button
                onClick={handleAddTask}
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md h-11 lg:h-12 px-6 lg:px-8 text-sm lg:text-base w-full sm:w-auto"
              >
                Add Task
              </Button>
            </div>

            {/* Empty State */}
            {filteredTasks.length === 0 && (
              <p className="text-center text-slate-400 py-8 lg:py-12 text-base lg:text-lg px-4">
                {selectedFolder 
                  ? `No tasks in this folder yet. Add one above to get started!`
                  : "No tasks yet. Add one above to get started!"
                }
              </p>
            )}

            {/* Tasks List */}
            <ul className="space-y-3 lg:space-y-5">
              {filteredTasks.map((task) => (
              <li
                key={task.id}
                className={`flex flex-col p-4 lg:p-5 rounded-lg transition-all duration-300 ease-in-out shadow-md hover:shadow-lg
                ${
                  task.completed
                    ? "bg-slate-800/60 border border-slate-700"
                    : "bg-slate-800 border border-slate-700 hover:border-sky-600"
                }
              `}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3 lg:space-x-4 flex-1 min-w-0">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => handleToggleComplete(task.id)}
                      className="border-slate-600 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600 shrink-0"
                    />
                    {editingTaskId === task.id ? (
                      <Input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleSaveEdit(task.id);
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                        className="flex-1 bg-slate-700 border-slate-600 text-slate-100 h-8 lg:h-9 text-sm px-3"
                        autoFocus
                      />
                    ) : (
                      <label
                        htmlFor={`task-${task.id}`}
                        className={`cursor-pointer text-sm lg:text-base truncate py-1 ${
                          task.completed
                            ? "line-through text-slate-500"
                            : "text-slate-100"
                        }`}
                        onDoubleClick={() => handleStartEdit(task)}
                        title={task.text}
                      >
                        {task.text}
                      </label>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 shrink-0 ml-2 lg:ml-3">
                    {editingTaskId === task.id ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSaveEdit(task.id)}
                          className="text-green-500 hover:text-green-400 hover:bg-slate-700/50 h-7 w-7 lg:h-8 lg:w-8"
                          aria-label="Save task"
                        >
                          <Save size={14} className="lg:hidden" />
                          <Save size={16} className="hidden lg:block" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCancelEdit}
                          className="text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 h-7 w-7 lg:h-8 lg:w-8"
                          aria-label="Cancel edit"
                        >
                          <X size={14} className="lg:hidden" />
                          <X size={16} className="hidden lg:block" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStartEdit(task)}
                          className="text-slate-400 hover:text-sky-500 hover:bg-slate-700/50 h-7 w-7 lg:h-8 lg:w-8"
                          aria-label="Edit task"
                        >
                          <Edit3 size={14} className="lg:hidden" />
                          <Edit3 size={16} className="hidden lg:block" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-slate-400 hover:text-red-500 hover:bg-slate-700/50 h-7 w-7 lg:h-8 lg:w-8"
                          aria-label="Delete task"
                        >
                          <X size={14} className="lg:hidden" />
                          <X size={16} className="hidden lg:block" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {(task.dueDate || task.priority || !task.completed) && (
                  <div className="mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-slate-700/50 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0 lg:space-x-3 text-xs text-slate-400">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-3">
                      {/* Due Date Selector */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            size="sm"
                            className={`justify-start text-left font-normal h-8 px-3 border-slate-700 hover:bg-slate-700/50 w-full sm:w-auto
                            ${!task.dueDate && "text-slate-500"}
                            ${task.dueDate && new Date(task.dueDate) < new Date() && !task.completed ? "text-red-400 border-red-600" : ""}
                          `}
                          >
                            <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                            {task.dueDate ? (
                              format(task.dueDate, "MMM d, yyyy")
                            ) : (
                              <span>Set date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                          <Calendar
                            mode="single"
                            selected={task.dueDate}
                            onSelect={(date: Date | undefined) => handleSetDueDate(task.id, date)}
                            initialFocus
                            className="text-slate-100"
                          />
                           <Button variant="ghost" size="sm" className="w-full justify-start text-slate-400 hover:text-red-500 p-3" onClick={() => handleSetDueDate(task.id, undefined)}>Clear Date</Button>
                        </PopoverContent>
                      </Popover>

                      {/* Priority Selector */}
                      <div className="flex items-center space-x-2">
                        <Select
                          value={task.priority || ""}
                          onValueChange={(value: "low" | "medium" | "high") =>
                            handleSetPriority(task.id, value)
                          }
                        >
                          <SelectTrigger className="h-8 px-3 text-xs border-slate-700 hover:bg-slate-700/50 w-full sm:w-[130px]">
                            <SelectValue placeholder="Set priority">
                              {task.priority ? (
                                <div className="flex items-center space-x-2">
                                  {getPriorityIcon(task.priority)}
                                  <span className="capitalize">{task.priority}</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <Tag className="h-4 w-4 text-slate-500" />
                                  <span>Set priority</span>
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                            <SelectItem value="low" className="focus:bg-slate-700 py-2">
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>Low</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="medium" className="focus:bg-slate-700 py-2">
                              <div className="flex items-center space-x-2">
                                <Info className="h-4 w-4 text-yellow-500" />
                                <span>Medium</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="high" className="focus:bg-slate-700 py-2">
                              <div className="flex items-center space-x-2">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <span>High</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {/* Priority Clear Button */}
                        {task.priority && (
                           <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-red-500 shrink-0" onClick={() => handleSetPriority(task.id, undefined)}>
                              <X size={12} />
                           </Button>
                        )}
                      </div>

                      {/* Folder Selector for moving tasks between folders */}
                      <Select
                        value={task.folderId || "no-folder"}
                        onValueChange={(value: string) =>
                          handleMoveTaskToFolder(task.id, value === "no-folder" ? undefined : value)
                        }
                      >
                        <SelectTrigger className="h-8 px-3 text-xs border-slate-700 hover:bg-slate-700/50 w-full sm:w-[140px]">
                          <SelectValue placeholder="Move to folder">
                            {task.folderId ? (
                              <div className="flex items-center space-x-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: folders.find(f => f.id === task.folderId)?.color }}
                                ></div>
                                <span className="truncate">
                                  {folders.find(f => f.id === task.folderId)?.name || "Unknown"}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Folder className="h-4 w-4 text-slate-500" />
                                <span>No folder</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectItem value="no-folder" className="focus:bg-slate-700 py-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                              <span>No folder</span>
                            </div>
                          </SelectItem>
                          {folders.map((folder) => (
                            <SelectItem key={folder.id} value={folder.id} className="focus:bg-slate-700 py-2">
                              <div className="flex items-center space-x-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: folder.color }}
                                ></div>
                                <span className="truncate">{folder.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Completion Status */}
                    {task.completed && (
                        <span className="text-green-500 text-xs font-medium self-start lg:self-auto">Completed</span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
        {/* Footer showing task count */}
        {filteredTasks.length > 0 && (
            <CardFooter className="border-t border-slate-700 pt-4 lg:pt-6 text-sm text-slate-500">
                <p>{filteredTasks.filter(t => !t.completed).length} tasks remaining</p>
            </CardFooter>
        )}
      </Card>
      </div> {/* Close the main container div */}
    </main>
  );
}