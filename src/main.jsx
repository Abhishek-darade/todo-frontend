import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

const API_URL = import.meta.env.VITE_API_URL;  // ✅ आता env variable वापरतोय

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // Fetch todos on load
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTodos(data));
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTodo, completed: false })
    })
      .then(res => res.json())
      .then(() => {
        setNewTodo("");
        fetchTodos();
      });
  };

  const updateTodo = (id) => {
    const title = prompt("Edit todo:");
    if (!title) return;
    fetch(`${API_URL}/${id}`, {   // ✅ env var वापरतोय
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, completed: false })
    })
      .then(res => res.json())
      .then(() => fetchTodos());
  };

  const deleteTodo = (id) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })   // ✅ env var वापरतोय
      .then(() => fetchTodos());
  };

  return (
    <div>
      <h1>Todo App</h1>
      <div>
        <input
          type="text"
          placeholder="Enter new todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>

      <ul>
        {todos.map((todo, index) => (
          <li key={todo._id}>
            <span>{index + 1}. {todo.title}</span>
            <div className="actions">
              <button className="edit" onClick={() => updateTodo(todo._id)}>✏ Edit</button>
              <button className="delete" onClick={() => deleteTodo(todo._id)}>🗑 Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
