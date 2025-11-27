import React, { useState } from "react";
import "./CategoryForm.css";

function CategoryForm({ onAdd }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    onAdd(name);
    setName("");
  };

  return (
    <form className="form-card category-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button type="submit">Add Category</button>
    </form>
  );
}

export default CategoryForm;
