"use client";

import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { 
  X, 
  CalendarIcon, 
  Edit3, 
  Save, 
  Tag, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Folder, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  Minus 
} from "lucide-react";
import { format } from "date-fns";
import { useTaskContext } from "@/contexts/TaskContext";
import type { Task } from "@/types";

interface TaskItemProps {
  task: Task;
  isSubtask?: boolean;
  indentLevel?: number;
}

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

const TaskItem = memo<TaskItemProps>(({ 
  task, 
  isSubtask = false, 
  indentLevel = 0 
}) => {
  const {
    folders,
    editingTaskId,
    editText,
    expandedTasks,
    addingSubtaskTo,
    newSubtaskText,
    toggleTaskComplete,
    deleteTask,
    startEditTask,
    saveEditTask,
    cancelEditTask,
    setEditText,
    setTaskDueDate,
    setTaskPriority,
    moveTaskToFolder,
    toggleExpanded,
    startAddSubtask,
    saveSubtask,
    cancelAddSubtask,
    setNewSubtaskText,
    getSubtasks,
  } = useTaskContext();

  const subtasks = getSubtasks(task.id);
  const isExpanded = expandedTasks.has(task.id);
  const isEditing = editingTaskId === task.id;
  const isAddingSubtask = addingSubtaskTo === task.id;
  
  const stats = {
    total: subtasks.length,
    completed: subtasks.filter(task => task.completed).length,
    percentage: subtasks.length > 0 ? Math.round((subtasks.filter(task => task.completed).length / subtasks.length) * 100) : 0
  };

  return (
    <>
      <li
        className={`flex flex-col transition-all duration-300 ease-in-out shadow-md hover:shadow-lg
          ${isSubtask 
            ? "bg-slate-800/40 border border-slate-700/50 rounded-md p-3 ml-4 lg:ml-8" 
            : `p-4 lg:p-5 rounded-lg ${
                task.completed
                  ? "bg-slate-800/60 border border-slate-700"
                  : "bg-slate-800 border border-slate-700 hover:border-sky-600"
              }`
          }
        `}
        style={{ marginLeft: isSubtask ? `${indentLevel * 16}px` : '0px' }}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3 lg:space-x-4 flex-1 min-w-0">
            {!isSubtask && subtasks.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleExpanded(task.id)}
                className="h-6 w-6 text-slate-400 hover:text-sky-500 shrink-0"
                aria-label={isExpanded ? "Collapse subtasks" : "Expand subtasks"}
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </Button>
            )}
            
            {!isSubtask && subtasks.length === 0 && (
              <div className="w-6 h-6 shrink-0"></div>
            )}

            <Checkbox
              id={`task-${task.id}`}
              checked={task.completed}
              onCheckedChange={() => toggleTaskComplete(task.id)}
              className="border-slate-600 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600 shrink-0"
            />
            
            {isEditing ? (
              <Input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") saveEditTask(task.id);
                  if (e.key === "Escape") cancelEditTask();
                }}
                className="flex-1 bg-slate-700 border-slate-600 text-slate-100 h-8 lg:h-9 text-sm px-3"
                autoFocus
              />
            ) : (
              <div className="flex-1 min-w-0">
                <label
                  htmlFor={`task-${task.id}`}
                  className={`cursor-pointer text-sm lg:text-base block py-1 ${
                    task.completed
                      ? "line-through text-slate-500"
                      : "text-slate-100"
                  }`}
                  onDoubleClick={() => startEditTask(task)}
                  title={task.text}
                >
                  {task.text}
                </label>
                
                {!isSubtask && subtasks.length > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                      <div 
                        className="bg-sky-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${stats.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-400">
                      {stats.completed}/{stats.total}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1 shrink-0 ml-2 lg:ml-3">
            {!isSubtask && !isAddingSubtask && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => startAddSubtask(task.id)}
                className="text-slate-400 hover:text-green-500 hover:bg-slate-700/50 h-7 w-7 lg:h-8 lg:w-8"
                aria-label="Add subtask"
              >
                <Plus size={14} className="lg:hidden" />
                <Plus size={16} className="hidden lg:block" />
              </Button>
            )}
            
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => saveEditTask(task.id)}
                  className="text-green-500 hover:text-green-400 hover:bg-slate-700/50 h-7 w-7 lg:h-8 lg:w-8"
                  aria-label="Save task"
                >
                  <Save size={14} className="lg:hidden" />
                  <Save size={16} className="hidden lg:block" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={cancelEditTask}
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
                  onClick={() => startEditTask(task)}
                  className="text-slate-400 hover:text-sky-500 hover:bg-slate-700/50 h-7 w-7 lg:h-8 lg:w-8"
                  aria-label="Edit task"
                >
                  <Edit3 size={14} className="lg:hidden" />
                  <Edit3 size={16} className="hidden lg:block" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTask(task.id)}
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

        {!isSubtask && isAddingSubtask && (
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <div className="flex items-center space-x-2 ml-6 lg:ml-10">
              <Input
                type="text"
                placeholder="Add a subtask..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    saveSubtask(task.id);
                  }
                  if (e.key === "Escape") {
                    cancelAddSubtask();
                  }
                }}
                className="flex-1 bg-slate-700 border-slate-600 text-slate-100 h-8 text-sm px-3"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => saveSubtask(task.id)}
                className="text-green-500 hover:text-green-400 hover:bg-slate-700/50 h-8 w-8"
                aria-label="Add subtask"
              >
                <Save size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={cancelAddSubtask}
                className="text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 h-8 w-8"
                aria-label="Cancel add subtask"
              >
                <Minus size={14} />
              </Button>
            </div>
          </div>
        )}

        {(!isSubtask || task.dueDate || task.priority) && (task.dueDate || task.priority || !task.completed) && (
          <div className="mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-slate-700/50 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0 lg:space-x-3 text-xs text-slate-400">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-3">
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
                    onSelect={(date: Date | undefined) => setTaskDueDate(task.id, date)}
                    initialFocus
                    className="text-slate-100"
                  />
                   <Button variant="ghost" size="sm" className="w-full justify-start text-slate-400 hover:text-red-500 p-3" onClick={() => setTaskDueDate(task.id, undefined)}>Clear Date</Button>
                </PopoverContent>
              </Popover>

              <div className="flex items-center space-x-2">
                <Select
                  value={task.priority || ""}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setTaskPriority(task.id, value)
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
                {task.priority && (
                   <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-red-500 shrink-0" onClick={() => setTaskPriority(task.id, undefined)}>
                      <X size={12} />
                   </Button>
                )}
              </div>

              {!isSubtask && (
                <Select
                  value={task.folderId || "no-folder"}
                  onValueChange={(value: string) =>
                    moveTaskToFolder(task.id, value === "no-folder" ? undefined : value)
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
              )}
            </div>
            {task.completed && (
                <span className="text-green-500 text-xs font-medium self-start lg:self-auto">Completed</span>
            )}
          </div>
        )}
      </li>

      {!isSubtask && isExpanded && subtasks.map((subtask) => (
        <TaskItem 
          key={subtask.id} 
          task={subtask} 
          isSubtask={true} 
          indentLevel={1}
        />
      ))}
    </>
  );
});

TaskItem.displayName = "TaskItem";

export default TaskItem;