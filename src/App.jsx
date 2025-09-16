import { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Base URL ✅ (no localhost)
  const baseUrl = "/todos";

  // Get all todos
  useEffect(() => {
    fetch(baseUrl)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Fetch todos error:", err));
  }, []);

  // Add new todo
  const handleAdd = async () => {
    if (!newTodo.trim()) return;
    try {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodo }),
      });
      const data = await res.json();
      setTodos([...todos, data]);
      setNewTodo("");
    } catch (err) {
      console.error("Add todo error:", err);
    }
  };

  // Delete todo
  const handleDelete = async (id) => {
    try {
      await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("Delete todo error:", err);
    }
  };

  // Save updated todo
  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editText }),
      });
      const data = await res.json();

      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, title: data.title } : todo
        )
      );
      setEditingId(null);
      setEditText("");
    } catch (err) {
      console.error("Update todo error:", err);
    }
  };

  return (
    <div>
      <h1>Todo App</h1>

      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Enter new todo..."
      />
      <button onClick={handleAdd}>Add Todo</button>

      <ol>
        {todos.map((todo) => (
          <li key={todo._id}>
            {editingId === todo._id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => handleUpdate(todo._id)}>Save</button>
              </>
            ) : (
              <>
                <span>{todo.title}</span>
                <button
                  className="edit"
                  onClick={() => {
                    setEditingId(todo._id);
                    setEditText(todo.title);
                  }}
                >
                  ✏ Edit
                </button>
                <button
                  className="delete"
                  onClick={() => handleDelete(todo._id)}
                >
                  🗑 Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;
