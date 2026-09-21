import './style.css';
import type { Task, TaskFilter, Priority } from './types/task';
import { StorageService } from './services/storageService';

// Estado local
let tasks: Task[] = StorageService.getTasks();
let filter: TaskFilter = { status: 'todas', priority: 'todas', searchQuery: '' };

// Elementos del DOM
const form = document.getElementById('task-form') as HTMLFormElement;
const taskIdInput = document.getElementById('task-id') as HTMLInputElement;
const titleInput = document.getElementById('title') as HTMLInputElement;
const descInput = document.getElementById('description') as HTMLTextAreaElement;
const categoryInput = document.getElementById('category') as HTMLInputElement;
const prioritySelect = document.getElementById('priority') as HTMLSelectElement;
const taskList = document.getElementById('task-list') as HTMLUListElement;
const btnCancel = document.getElementById('btn-cancel') as HTMLButtonElement;
const formTitle = document.getElementById('form-title') as HTMLHeadingElement;

const searchInput = document.getElementById('search-input') as HTMLInputElement;
const filterStatus = document.getElementById('filter-status') as HTMLSelectElement;
const filterPriority = document.getElementById('filter-priority') as HTMLSelectElement;

// Renderizar Tareas
function renderTasks() {
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(t => {
    const matchesStatus = 
      filter.status === 'todas' ? true :
      filter.status === 'completadas' ? t.completed : !t.completed;

    const matchesPriority = 
      filter.priority === 'todas' ? true : t.priority === filter.priority;

    const matchesSearch = t.title.toLowerCase().includes(filter.searchQuery.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });

  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<li style="text-align:center; padding: 15px;">No hay tareas disponibles.</li>';
    return;
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item p-${task.priority} ${task.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <div>
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <small><strong>Categoría:</strong> ${task.category} | <strong>Prioridad:</strong> ${task.priority.toUpperCase()}</small>
      </div>
      <div class="task-actions">
        <button class="btn-toggle">${task.completed ? 'Desmarcar' : 'Completar'}</button>
        <button class="btn-edit">Editar</button>
        <button class="btn-delete">Eliminar</button>
      </div>
    `;

    // Eventos por item
    li.querySelector('.btn-toggle')?.addEventListener('click', () => toggleTask(task.id));
    li.querySelector('.btn-edit')?.addEventListener('click', () => editTask(task));
    li.querySelector('.btn-delete')?.addEventListener('click', () => deleteTask(task.id));

    taskList.appendChild(li);
  });
}

// Guardar / Editar Tarea
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = taskIdInput.value;

  if (id) {
    tasks = tasks.map(t => t.id === id ? {
      ...t,
      title: titleInput.value,
      description: descInput.value,
      category: categoryInput.value,
      priority: prioritySelect.value as Priority
    } : t);
  } else {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: titleInput.value,
      description: descInput.value,
      category: categoryInput.value,
      priority: prioritySelect.value as Priority,
      completed: false,
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
  }

  StorageService.saveTasks(tasks);
  resetForm();
  renderTasks();
});

function toggleTask(id: string) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  StorageService.saveTasks(tasks);
  renderTasks();
}

function deleteTask(id: string) {
  if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
    tasks = tasks.filter(t => t.id !== id);
    StorageService.saveTasks(tasks);
    renderTasks();
  }
}

function editTask(task: Task) {
  taskIdInput.value = task.id;
  titleInput.value = task.title;
  descInput.value = task.description;
  categoryInput.value = task.category;
  prioritySelect.value = task.priority;
  
  formTitle.textContent = 'Editar Tarea';
  btnCancel.classList.remove('hidden');
}

function resetForm() {
  form.reset();
  taskIdInput.value = '';
  formTitle.textContent = 'Nueva Tarea';
  btnCancel.classList.add('hidden');
}

btnCancel.addEventListener('click', resetForm);

// Eventos de Filtro y Búsqueda
searchInput.addEventListener('input', (e) => {
  filter.searchQuery = (e.target as HTMLInputElement).value;
  renderTasks();
});

filterStatus.addEventListener('change', (e) => {
  filter.status = (e.target as HTMLSelectElement).value as TaskFilter['status'];
  renderTasks();
});

filterPriority.addEventListener('change', (e) => {
  filter.priority = (e.target as HTMLSelectElement).value as TaskFilter['priority'];
  renderTasks();
});

// Carga inicial
renderTasks();