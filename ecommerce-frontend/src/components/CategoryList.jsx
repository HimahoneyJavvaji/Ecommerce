import React, { useState } from "react";
import "./CategoryList.css";

function CategoryList({ categories, onDelete, onUpdate, onViewItems }) {
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  return (
    <div className="sidebar">
      <h3>Categories</h3>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>
            {editingId === cat.id ? (
              <>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button
                  className="edit"
                  onClick={() => {
                    onUpdate(cat.id, newName);
                    setEditingId(null);
                  }}
                >
                  Save
                </button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{cat.name}</span>
                <div>
                  <button
                    className="edit"
                    onClick={() => {
                      setEditingId(cat.id);
                      setNewName(cat.name);
                    }}
                  >
                    Edit
                  </button>
                  <button className="delete" onClick={() => onDelete(cat.id)}>
                    Delete
                  </button>
                  <button className="view" onClick={() => onViewItems(cat.id)}>
                    View Items
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryList;
