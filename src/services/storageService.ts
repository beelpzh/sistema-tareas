import type { Task } from '../types/task';

const STORAGE_KEY = 'tasks_app_data_v1';

export const StorageService = {
  getTasks(): Task[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
};