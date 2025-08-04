"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
import { X, CalendarIcon, Edit3, Save, Tag, AlertCircle, Info, CheckCircle } from "lucide-react"; // Added icons
import { format } from "date-fns"; // For formatting dates

// Define the structure of a task
interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: Date; // Optional due date
  priority?: "low" | "medium" | "high"; // Optional priority
}

const LOCAL_STORAGE_KEY = "todoApp.tasks";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // Load tasks from local storage on initial render
  useEffect(() => {
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTasks) {
      // Parse dates correctly from JSON
      const parsedTasks = JSON.parse(storedTasks).map((task: Task) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));
      setTasks(parsedTasks);
    }
  }, []);

  // Save tasks to local storage whenever they change
  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem(LOCAL_STORAGE_KEY)) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  // Function to add a new task
  const handleAddTask = () => {
    if (newTaskText.trim() === "") return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: newTaskText,
      completed: false,
      // dueDate and priority can be added later or via a more complex form
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]); // Add new tasks to the top
    setNewTaskText("");
  };

  // Function to toggle task completion
  const handleToggleComplete = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Function to delete a task
  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  // Function to start editing a task
  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditText(task.text);
  };

  // Function to save edited task
  const handleSaveEdit = (taskId: string) => {
    if (editText.trim() === "") return; // Don\'t save empty text
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, text: editText } : task
      )
    );
    setEditingTaskId(null);
    setEditText("");
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditText("");
  };

  // Function to set due date
  const handleSetDueDate = (taskId: string, date?: Date) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, dueDate: date } : task
      )
    );
  };

  // Function to set priority
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>

      <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24 bg-gradient-to-br from-slate-950 to-slate-800 text-slate-50">
        <Card className="w-full max-w-2xl bg-slate-900/80 border-slate-700 shadow-2xl backdrop-blur-sm">
          <CardHeader className="border-b border-slate-700 pb-4">
            <CardTitle className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
              My Advanced To-Do List
            </CardTitle>
            <CardDescription className="text-center text-slate-400 pt-1">
              Organize your tasks with due dates and priorities.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex w-full items-center space-x-2 mb-8">
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
                className="flex-1 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-sky-500 focus:border-sky-500 rounded-md h-11 text-base"
              />
              <Button
                onClick={handleAddTask}
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md h-11 px-6 text-base"
              >
                Add Task
              </Button>
            </div>

            {tasks.length === 0 && (
              <p className="text-center text-slate-400 py-8 text-lg">
                No tasks yet. Add one above to get started!
              </p>
            )}

            <ul className="space-y-4">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className={`flex flex-col p-4 rounded-lg transition-all duration-300 ease-in-out shadow-md hover:shadow-lg
                  ${
                    task.completed
                      ? "bg-slate-800/60 border border-slate-700"
                      : "bg-slate-800 border border-slate-700 hover:border-sky-600"
                  }
                `}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
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
                          className="flex-1 bg-slate-700 border-slate-600 text-slate-100 h-8 text-sm"
                          autoFocus
                        />
                      ) : (
                        <label
                          htmlFor={`task-${task.id}`}
                          className={`cursor-pointer text-base truncate ${
                            task.completed
                              ? "line-through text-slate-500"
                              : "text-slate-100"
                          }`}
                          onDoubleClick={() => handleStartEdit(task)}
                          title={task.text} // Show full text on hover if truncated
                        >
                          {task.text}
                        </label>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      {editingTaskId === task.id ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSaveEdit(task.id)}
                            className="text-green-500 hover:text-green-400 hover:bg-slate-700/50"
                            aria-label="Save task"
                          >
                            <Save size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCancelEdit}
                            className="text-slate-400 hover:text-slate-300 hover:bg-slate-700/50"
                            aria-label="Cancel edit"
                          >
                            <X size={18} />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStartEdit(task)}
                            className="text-slate-400 hover:text-sky-500 hover:bg-slate-700/50"
                            aria-label="Edit task"
                          >
                            <Edit3 size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-slate-400 hover:text-red-500 hover:bg-slate-700/50"
                            aria-label="Delete task"
                          >
                            <X size={18} />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {(task.dueDate || task.priority || !task.completed) && ( // Show details if not completed or if details exist
                    <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between space-x-2 text-xs text-slate-400">
                      <div className="flex items-center space-x-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              size="sm"
                              className={`justify-start text-left font-normal h-7 px-2 border-slate-700 hover:bg-slate-700/50
                              ${!task.dueDate && "text-slate-500"}
                              ${task.dueDate && new Date(task.dueDate) < new Date() && !task.completed ? "text-red-400 border-red-600" : ""}
                            `}
                            >
                              <CalendarIcon className="mr-1 h-3.5 w-3.5" />
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
                              onSelect={(date: Date | undefined) => handleSetDueDate(task.id, date)} // Added type for date
                              initialFocus
                              className="text-slate-100"
                            />
                             <Button variant="ghost" size="sm" className="w-full justify-start text-slate-400 hover:text-red-500" onClick={() => handleSetDueDate(task.id, undefined)}>Clear Date</Button>
                          </PopoverContent>
                        </Popover>

                        <Select
                          value={task.priority}
                          onValueChange={(value: "low" | "medium" | "high") =>
                            handleSetPriority(task.id, value)
                          }
                        >
                          <SelectTrigger className="h-7 px-2 text-xs border-slate-700 hover:bg-slate-700/50 w-[120px]">
                           <div className="flex items-center">
                            {getPriorityIcon(task.priority)}
                            <SelectValue placeholder="Set priority" className="ml-1" />
                           </div>
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                            <SelectItem value="low" className="text-green-500 focus:bg-slate-700">Low</SelectItem>
                            <SelectItem value="medium" className="text-yellow-500 focus:bg-slate-700">Medium</SelectItem>
                            <SelectItem value="high" className="text-red-500 focus:bg-slate-700">High</SelectItem>
                          </SelectContent>
                        </Select>
                         {task.priority && (
                           <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-red-500" onClick={() => handleSetPriority(task.id, undefined)}>
                              <X size={14} />
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
              <CardFooter className="border-t border-slate-700 pt-4 text-sm text-slate-500">
                  <p>{tasks.filter(t => !t.completed).length} tasks remaining</p>
              </CardFooter>
          )}
        </Card>
      </main>
    </div>
  );
}
