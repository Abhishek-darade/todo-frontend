import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

// ✅ Localhost काढून टाकलं
const baseUrl = "/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // Fetch todos on load
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    fetch(baseUrl)
      .then(res => res.json())
      .then(data => setTodos(data));
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    fetch(baseUrl, {
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
    fetch(`${baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, completed: false })
    })
      .then(res => res.json())
      .then(() => fetchTodos());
  };

  const deleteTodo = (id) => {
    fetch(`${baseUrl}/${id}`, { method: "DELETE" })
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
