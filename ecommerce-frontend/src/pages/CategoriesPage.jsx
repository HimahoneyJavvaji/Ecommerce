import React, { useState, useEffect } from "react";
import CategoryForm from "../components/CategoryForm";
import CategoryList from "../components/CategoryList";
import ItemForm from "../components/ItemForm";
import ItemList from "../components/ItemList";
import "./CategoriesPage.css";

const CATEGORY_API = "http://backend:8081/api/categories";
const ITEM_API = "http://backend:8081/api/items";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const res = await fetch(CATEGORY_API, { headers: { Authorization: `Bearer ${token}` } });
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
      const res = await fetch(`${ITEM_API}/category/${categoryId}`, { headers: { Authorization: `Bearer ${token}` } });
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

  const addCategory = async (name) => {
    await fetch(CATEGORY_API, { 
      method: "POST", 
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, 
      body: JSON.stringify({ name }) 
    });
    fetchCategories();
  };

  const updateCategory = async (id, newName) => {
    await fetch(`${CATEGORY_API}/${id}`, { 
      method: "PUT", 
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, 
      body: JSON.stringify({ name: newName }) 
    });
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    await fetch(`${CATEGORY_API}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchCategories();
    if (selectedCategoryId === id) setSelectedCategoryId(null);
  };

  const addItem = async (item) => {
    if (!selectedCategoryId) return;
    await fetch(`${ITEM_API}/${selectedCategoryId}`, { 
      method: "POST", 
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, 
      body: JSON.stringify(item) 
    });
    fetchItems(selectedCategoryId);
  };

  const updateItem = async (id, item) => {
    await fetch(`${ITEM_API}/${id}`, { 
      method: "PUT", 
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, 
      body: JSON.stringify(item) 
    });
    fetchItems(selectedCategoryId);
  };

  const deleteItem = async (id) => {
    await fetch(`${ITEM_API}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchItems(selectedCategoryId);
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>Categories</h2>
        <CategoryForm onAdd={addCategory} />
        {loading ? <p>Loading...</p> : (
          <CategoryList
            categories={categories}
            onDelete={deleteCategory}
            onUpdate={updateCategory}
            onViewItems={handleViewItems}
          />
        )}
      </aside>
      <main className="content">
        {selectedCategoryId ? (
          <>
            <h2>Items in "{categories.find(c => c.id === selectedCategoryId)?.name}"</h2>
            <ItemForm onAdd={addItem} />
            <div className="item-grid">
              <ItemList
                items={items}
                userRole="ROLE_ADMIN"
                onDelete={deleteItem}
                onUpdate={updateItem}
              />
            </div>
          </>
        ) : (
          <p>Select a category to view items.</p>
        )}
      </main>
    </div>
  );
}

export default CategoriesPage;
