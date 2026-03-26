import { useState } from "react";
import styles from "./styles";

// ============================================================
// SINGLE TODO ITEM COMPONENT
// Props: todo (object), onDelete, onToggle, onEdit
// ============================================================
function TodoItem({ todo, onDelete, onToggle, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  function handleSave() {
    if (editText.trim() === "") return;
    onEdit(todo.id, editText.trim());
    setIsEditing(false);
  }

  return (
    <div style={{
      ...styles.todoItem,
      opacity: todo.completed ? 0.55 : 1,
      borderColor: todo.completed ? "#2a2a3d" : "#3d3d5c",
    }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        style={styles.checkbox}
      />

      {isEditing ? (
        <input
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSave()}
          style={styles.editInput}
          autoFocus
        />
      ) : (
        <span style={{
          ...styles.todoText,
          textDecoration: todo.completed ? "line-through" : "none",
          color: todo.completed ? "#555577" : "#e8e8f0",
        }}>
          {todo.text}
        </span>
      )}

      <span style={{
        ...styles.badge,
        background: todo.priority === "high" ? "rgba(252,92,125,0.15)" :
                    todo.priority === "medium" ? "rgba(255,183,0,0.15)" :
                    "rgba(46,125,50,0.15)",
        color: todo.priority === "high" ? "#fc5c7d" :
               todo.priority === "medium" ? "#ffb700" : "#81c784",
      }}>
        {todo.priority}
      </span>

      <div style={styles.actions}>
        {isEditing ? (
          <button style={styles.btnSave} onClick={handleSave}>Save</button>
        ) : (
          <button style={styles.btnEdit} onClick={() => setIsEditing(true)}>Edit</button>
        )}
        <button style={styles.btnDelete} onClick={() => onDelete(todo.id)}>Delete</button>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Complete LAB 1 - Portfolio", completed: true, priority: "high" },
    { id: 2, text: "Complete LAB 2 - JS Intro", completed: false, priority: "high" },
    { id: 3, text: "Push code to GitHub", completed: false, priority: "medium" },
    { id: 4, text: "Review React notes", completed: false, priority: "low" },
  ]);

  const [newText, setNewText] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [filter, setFilter] = useState("all");

  // CREATE
  function addTodo() {
    if (newText.trim() === "") return;
    const newTodo = {
      id: Date.now(),
      text: newText.trim(),
      completed: false,
      priority: newPriority,
    };
    setTodos(prev => [newTodo, ...prev]);
    setNewText("");
  }

  // DELETE
  function deleteTodo(id) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  // UPDATE (TOGGLE)
  function toggleTodo(id) {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  // UPDATE (EDIT TEXT)
  function editTodo(id, newText) {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, text: newText } : t))
    );
  }

  // DELETE ALL COMPLETED
  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed));
  }

  // FILTERING
  const filteredTodos = todos.filter(t => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  // STATS
  const totalCount = todos.length;
  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = totalCount - completedCount;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>My Todo List</h1>
        <p style={styles.subtitle}>LAB 4 — React CRUD</p>

        <div style={styles.stats}>
          <span style={styles.stat}><b>{totalCount}</b> total</span>
          <span style={styles.stat}><b style={{ color: "#7c5cfc" }}>{activeCount}</b> active</span>
          <span style={styles.stat}><b style={{ color: "#81c784" }}>{completedCount}</b> done</span>
        </div>

        <div style={styles.addBar}>
          <input
            type="text"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTodo()}
            placeholder="Add a new task..."
            style={styles.mainInput}
          />
          <select
            value={newPriority}
            onChange={e => setNewPriority(e.target.value)}
            style={styles.select}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button onClick={addTodo} style={styles.addBtn}>+ Add</button>
        </div>

        <div style={styles.filterBar}>
          {["all", "active", "completed"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...styles.filterBtn,
                background: filter === f ? "#7c5cfc" : "transparent",
                color: filter === f ? "white" : "#8888aa",
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div style={styles.list}>
          {filteredTodos.length === 0 ? (
            <p style={styles.emptyMsg}>
              {filter === "completed" ? "Nothing completed yet." : "No tasks here!"}
            </p>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={deleteTodo}
                onToggle={toggleTodo}
                onEdit={editTodo}
              />
            ))
          )}
        </div>

        {completedCount > 0 && (
          <button onClick={clearCompleted} style={styles.clearBtn}>
            Clear {completedCount} completed
          </button>
        )}
      </div>
    </div>
  );
}
