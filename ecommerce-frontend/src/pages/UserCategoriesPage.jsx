import React, { useState, useEffect } from "react";
import "./UserCategoriesPage.css";
import ItemList from "../components/ItemList";

const CATEGORY_API = "http://backend:8081/api/categories";
const ITEM_API = "http://backend:8081/api/items";

function UserCategoriesPage({ cart, setCart }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [items, setItems] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(CATEGORY_API);
      if (!res.ok) throw new Error("Failed to fetch categories");
      setCategories(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async (categoryId) => {
    try {
      const res = await fetch(`${ITEM_API}/category/${categoryId}`);
      if (!res.ok) throw new Error("Failed to fetch items");
      setItems(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleViewItems = (categoryId) => {
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
      setItems([]);
    } else {
      setSelectedCategoryId(categoryId);
      fetchItems(categoryId);
    }
  };

  const handleAddToCart = (item, quantity) => {
    setCart(prev => {
      const existing = prev.find(ci => ci.id === item.id);
      if (existing) {
        const updated = prev.map(ci =>
          ci.id === item.id ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
        return updated.filter(ci => ci.quantity > 0);
      } else if (quantity > 0) {
        return [...prev, { ...item, quantity }];
      }
      return prev;
    });
  };

  return (
    <div className="user-dashboard" style={{ display: "flex", gap: "2rem" }}>
      <aside style={{ minWidth: "200px" }}>
        <h2>Categories</h2>
        {loading ? <p>Loading...</p> : (
          <ul>
            {categories.map(cat => (
              <li key={cat.id}>
                <button onClick={() => handleViewItems(cat.id)}>{cat.name}</button>
              </li>
            ))}
          </ul>
        )}
      </aside>
      <main style={{ flex: 1 }}>
        {selectedCategoryId ? (
          <>
            <h2>Items in "{categories.find(c => c.id === selectedCategoryId)?.name}"</h2>
            <ItemList
              items={items}
              userRole="ROLE_USER"
              onAddToCart={handleAddToCart} // updates cart in App.jsx
            />
          </>
        ) : (
          <p>Select a category to view items.</p>
        )}
      </main>
    </div>
  );
}

export default UserCategoriesPage;
