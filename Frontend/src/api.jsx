import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getTodos = () => API.get('/todos');
export const addTodo = (todo) => API.post('/todos', { title: todo });
export const deleteTodo = (id) => API.delete(`/todos/${id}`);
export const summarizeTodos = () => API.post('/summarize');
