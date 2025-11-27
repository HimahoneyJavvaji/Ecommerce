import React, { useState } from "react";
import "./ItemForm.css";

function ItemForm({ onAdd }) {
  const [item, setItem] = useState({
    name: "",
    price: "",
    imageUrl: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item.name || !item.price) return;
    onAdd(item);
    setItem({ name: "", price: "", imageUrl: "", description: "" });
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Item name"
        value={item.name}
        onChange={(e) => setItem({ ...item, name: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={item.price}
        onChange={(e) => setItem({ ...item, price: parseFloat(e.target.value) })}
        required
      />
      <input
        type="text"
        placeholder="Image URL"
        value={item.imageUrl}
        onChange={(e) => setItem({ ...item, imageUrl: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={item.description}
        onChange={(e) => setItem({ ...item, description: e.target.value })}
      />
      <button type="submit">Add Item</button>
    </form>
  );
}

export default ItemForm;
