"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, Edit3, Save, Folder, FolderPlus } from "lucide-react";
import TaskItem from "@/components/TaskItem";
import { TaskProvider, useTaskContext } from "@/contexts/TaskContext";

function TaskAppContent() {
  const {
    folders,
    editingFolderId,
    editFolderText,
    selectedFolder,
    addFolder,
    deleteFolder: removeFolderAndMoveTasks,
    startEditFolder,
    saveEditFolder,
    cancelEditFolder,
    setEditFolderText,
    setSelectedFolder,
    getFilteredTasks,
    getTaskCountForFolder,
    addTask,
  } = useTaskContext();
  
  // Local UI state for new inputs
  const [newTaskText, setNewTaskText] = useState("");
  const [newFolderText, setNewFolderText] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);

  // Task handlers
  const handleAddTask = () => {
    if (newTaskText.trim() === "") return;
    addTask({
      text: newTaskText,
      completed: false,
      folderId: selectedFolder || undefined,
    });
    setNewTaskText("");
  };

  // Folder handlers
  const handleAddFolder = () => {
    if (newFolderText.trim() === "") return;
    addFolder(newFolderText);
    setNewFolderText("");
    setShowNewFolderInput(false);
  };

  // Computed values
  const filteredTasks = getFilteredTasks(selectedFolder);

  return (
    <main className="flex min-h-screen flex-col items-center p-3 sm:p-6 md:p-10 lg:p-14 xl:p-28 bg-gradient-to-br from-slate-950 to-slate-800 text-slate-50">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-4 lg:gap-6">
        
        {/* Folder Sidebar */}
        <Card className="w-full lg:w-80 bg-slate-900/80 border-slate-700 shadow-2xl backdrop-blur-sm h-fit order-2 lg:order-1">
          <CardHeader className="border-b border-slate-700 pb-3 lg:pb-4">
            <CardTitle className="text-lg lg:text-xl font-bold text-slate-100 flex items-center gap-2">
              <Folder className="h-4 w-4 lg:h-5 lg:w-5" />
              Folders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 lg:p-4">
            {/* All Tasks option */}
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
                          if (e.key === "Enter") saveEditFolder(folder.id);
                          if (e.key === "Escape") cancelEditFolder();
                        }}
                        className="flex-1 h-7 text-sm bg-slate-700 border-slate-600"
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-green-500 hover:text-green-400"
                        onClick={() => saveEditFolder(folder.id)}
                      >
                        <Save size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-slate-300"
                        onClick={cancelEditFolder}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  ) : (
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
                            startEditFolder(folder);
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
                            removeFolderAndMoveTasks(folder.id);
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

        {/* Main Tasks Panel */}
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

            {/* Tasks List - Clean implementation with context */}
            <ul className="space-y-3 lg:space-y-5">
              {filteredTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </ul>
        </CardContent>
        
        {filteredTasks.length > 0 && (
            <CardFooter className="border-t border-slate-700 pt-4 lg:pt-6 text-sm text-slate-500">
                <p>{filteredTasks.filter(t => !t.completed).length} tasks remaining</p>
            </CardFooter>
        )}
      </Card>
      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <TaskProvider>
      <TaskAppContent />
    </TaskProvider>
  );
}