export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: Date;
  priority?: "low" | "medium" | "high";
  folderId?: string;
  parentTaskId?: string;
}

export interface Folder {
  id: string;
  name: string;
  color?: string;
}