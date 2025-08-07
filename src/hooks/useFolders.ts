import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Folder } from '@/types';

const FOLDERS_STORAGE_KEY = "todoApp.folders";

export function useFolders() {
  const [folders, setFolders, isLoading, error] = useLocalStorage<Folder[]>(FOLDERS_STORAGE_KEY, []);

  const addFolder = useCallback((name: string) => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    };
    setFolders((prevFolders) => [...prevFolders, newFolder]);
    return newFolder.id;
  }, [setFolders]);

  const updateFolder = useCallback((folderId: string, updates: Partial<Folder>) => {
    setFolders((prevFolders) =>
      prevFolders.map((folder) =>
        folder.id === folderId ? { ...folder, ...updates } : folder
      )
    );
  }, [setFolders]);

  const deleteFolder = useCallback((folderId: string) => {
    setFolders((prevFolders) => 
      prevFolders.filter((folder) => folder.id !== folderId)
    );
  }, [setFolders]);

  const renameFolder = useCallback((folderId: string, name: string) => {
    updateFolder(folderId, { name });
  }, [updateFolder]);

  return {
    folders,
    isLoading,
    error,
    addFolder,
    updateFolder,
    deleteFolder,
    renameFolder,
  };
}