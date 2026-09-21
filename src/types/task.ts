export type Priority = 'baja' | 'media' | 'alta';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
}

export interface TaskFilter {
  status: 'todas' | 'completadas' | 'pendientes';
  priority: 'todas' | Priority;
  searchQuery: string;
}