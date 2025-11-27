import React, { useState } from "react";
import "./ItemList.css";

function ItemList({ items, userRole, onDelete, onUpdate, onAddToCart }) {
  const [editingId, setEditingId] = useState(null);
  const [editItem, setEditItem] = useState({});
  const [quantities, setQuantities] = useState({}); // For user cart

  const handleIncrement = (item) => {
    const current = quantities[item.id] || 0;
    setQuantities({ ...quantities, [item.id]: current + 1 });
    if (onAddToCart) onAddToCart(item, 1);
  };

  const handleDecrement = (item) => {
    const current = quantities[item.id] || 0;
    if (current <= 0) return;
    setQuantities({ ...quantities, [item.id]: current - 1 });
    if (onAddToCart) onAddToCart(item, -1);
  };

  return (
    <div className="item-list">
      {items.map((item) => (
        <div key={item.id} className="item-card">
          {userRole === "ROLE_ADMIN" ? (
            editingId === item.id ? (
              <>
                <div className="item-info">
                  <input
                    value={editItem.name}
                    onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                  />
                  <input
                    type="number"
                    value={editItem.price}
                    onChange={(e) =>
                      setEditItem({ ...editItem, price: parseFloat(e.target.value) })
                    }
                  />
                  <input
                    value={editItem.imageUrl}
                    onChange={(e) => setEditItem({ ...editItem, imageUrl: e.target.value })}
                  />
                  <input
                    value={editItem.description}
                    onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                  />
                </div>
                <div>
                  <button
                    className="update"
                    onClick={() => {
                      onUpdate(item.id, editItem);
                      setEditingId(null);
                    }}
                  >
                    Save
                  </button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="item-info">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
                  <strong>{item.name}</strong> - ${item.price}
                </div>
                <div>
                  <button
                    className="update"
                    onClick={() => {
                      setEditingId(item.id);
                      setEditItem(item);
                    }}
                  >
                    Edit
                  </button>
                  <button className="delete" onClick={() => onDelete(item.id)}>
                    Delete
                  </button>
                </div>
              </>
            )
          ) : (
            // USER VIEW
            <div className="user-actions">
              <div className="item-info">
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
                <strong>{item.name}</strong> - ${item.price}
              </div>
              <div className="cart-buttons">
                <button onClick={() => handleDecrement(item)}>-</button>
                <span>{quantities[item.id] || 0}</span>
                <button onClick={() => handleIncrement(item)}>+</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ItemList;
