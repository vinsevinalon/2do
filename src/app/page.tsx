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
import { X, CalendarIcon, Edit3, Save, Tag, AlertCircle, Info, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: Date;
  priority?: "low" | "medium" | "high";
}

const LOCAL_STORAGE_KEY = "todoApp.tasks";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks).map((task: Task) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));
      setTasks(parsedTasks);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem(LOCAL_STORAGE_KEY)) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  const handleAddTask = () => {
    if (newTaskText.trim() === "") return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: newTaskText,
      completed: false,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setNewTaskText("");
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditText(task.text);
  };

  const handleSaveEdit = (taskId: string) => {
    if (editText.trim() === "") return;
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, text: editText } : task
      )
    );
    setEditingTaskId(null);
    setEditText("");
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditText("");
  };

  const handleSetDueDate = (taskId: string, date?: Date) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, dueDate: date } : task
      )
    );
  };

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

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-10 md:p-14 lg:p-28 bg-gradient-to-br from-slate-950 to-slate-800 text-slate-50">
      <Card className="w-full max-w-2xl bg-slate-900/80 border-slate-700 shadow-2xl backdrop-blur-sm">
                <CardHeader className="border-b border-slate-700 pb-6">
          <CardTitle className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 mb-2">
            2do List 
          </CardTitle>
          <CardDescription className="text-center text-slate-400">
            Organize your tasks with due dates and priorities.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex w-full items-center space-x-3 mb-10">
            <Input
              type="text"
              placeholder="Add a new task..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddTask();
                }
              }}
              className="flex-1 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-sky-500 focus:border-sky-500 rounded-md h-12 text-base px-4"
            />
            <Button
              onClick={handleAddTask}
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md h-12 px-8 text-base"
            >
              Add Task
            </Button>
          </div>

          {tasks.length === 0 && (
            <p className="text-center text-slate-400 py-12 text-lg">
              No tasks yet. Add one above to get started!
            </p>
          )}

          <ul className="space-y-5">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`flex flex-col p-5 rounded-lg transition-all duration-300 ease-in-out shadow-md hover:shadow-lg
                ${
                  task.completed
                    ? "bg-slate-800/60 border border-slate-700"
                    : "bg-slate-800 border border-slate-700 hover:border-sky-600"
                }
              `}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
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
                        className="flex-1 bg-slate-700 border-slate-600 text-slate-100 h-9 text-sm px-3"
                        autoFocus
                      />
                    ) : (
                      <label
                        htmlFor={`task-${task.id}`}
                        className={`cursor-pointer text-base truncate py-1 ${
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
                  <div className="flex items-center space-x-1 shrink-0 ml-3">
                    {editingTaskId === task.id ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSaveEdit(task.id)}
                          className="text-green-500 hover:text-green-400 hover:bg-slate-700/50 h-8 w-8"
                          aria-label="Save task"
                        >
                          <Save size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCancelEdit}
                          className="text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 h-8 w-8"
                          aria-label="Cancel edit"
                        >
                          <X size={16} />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStartEdit(task)}
                          className="text-slate-400 hover:text-sky-500 hover:bg-slate-700/50 h-8 w-8"
                          aria-label="Edit task"
                        >
                          <Edit3 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-slate-400 hover:text-red-500 hover:bg-slate-700/50 h-8 w-8"
                          aria-label="Delete task"
                        >
                          <X size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {(task.dueDate || task.priority || !task.completed) && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between space-x-3 text-xs text-slate-400">
                    <div className="flex items-center space-x-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            size="sm"
                            className={`justify-start text-left font-normal h-8 px-3 border-slate-700 hover:bg-slate-700/50
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

                      <Select
                        value={task.priority}
                        onValueChange={(value: "low" | "medium" | "high") =>
                          handleSetPriority(task.id, value)
                        }
                      >
                        <SelectTrigger className="h-8 px-3 text-xs border-slate-700 hover:bg-slate-700/50 w-[130px]">
                          <SelectValue placeholder={
                            <div className="flex items-center space-x-2">
                              <Tag className="h-4 w-4 text-slate-500" />
                              <span>Set priority</span>
                            </div>
                          }>
                            {task.priority && (
                              <div className="flex items-center space-x-2">
                                {getPriorityIcon(task.priority)}
                                <span className="capitalize">{task.priority}</span>
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
                         <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-red-500" onClick={() => handleSetPriority(task.id, undefined)}>
                            <X size={12} />
                         </Button>
                       )}
                    </div>
                    {task.completed && (
                        <span className="text-green-500 text-xs font-medium">Completed</span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
        {tasks.length > 0 && (
            <CardFooter className="border-t border-slate-700 pt-6 text-sm text-slate-500">
                <p>{tasks.filter(t => !t.completed).length} tasks remaining</p>
            </CardFooter>
        )}
      </Card>
    </main>
  );
}