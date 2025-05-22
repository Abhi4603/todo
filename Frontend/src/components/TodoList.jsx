import React, { useEffect, useState } from 'react';
import { getTodos, addTodo, deleteTodo, summarizeTodos } from '../api';
import './TodoList.css';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');

  const loadTodos = async () => {
    const res = await getTodos();
    setTodos(res.data);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAdd = async () => {
    if (!input.trim()) return;
    const newTodo = { id: Date.now(), title: input };
    setTodos([...todos, newTodo]);
    setInput('');
    try {
      await addTodo(input);
      await loadTodos();
    } catch (error) {
      console.error('Failed to add todo:', error);
      setMessage('❌ Failed to add todo');
      await loadTodos();
    }
  };

  const handleDelete = async (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    try {
      await deleteTodo(id);
      await loadTodos();
    } catch (error) {
      console.error('Failed to delete todo:', error);
      setMessage('❌ Failed to delete todo');
      await loadTodos();
    }
  };

  const handleSummarize = async () => {
    setMessage('Summarizing...');
    try {
      const todosText = todos.map(todo => todo.title).join('\n');
      const res = await summarizeTodos(todosText);
      setMessage('✅ Summary sent to Slack!');
      console.log(res.data.summary || res);
    } catch (e) {
      console.error(e);
      setMessage('❌ Failed to send summary');
    }
  };

  return (
    <div>
      <h2>Todo Summary Assistant</h2>
      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter todo"
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.title}{' '}
            <button onClick={() => handleDelete(todo.id)}>❌</button>
          </li>
        ))}
      </ul>
      <button onClick={handleSummarize} style={{ marginTop: 20 }}>
        Summarize & Send to Slack
      </button>
      <p>{message}</p>
    </div>
  );
}
