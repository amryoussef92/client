import React, { useState } from "react";

const CategoryList = ({ categories, onDelete, onUpdate }) => {
  // State to track which category is being edited
  const [editingCategory, setEditingCategory] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedBudget, setUpdatedBudget] = useState("");

  // Handle editing of category
  const handleEditClick = (category) => {
    setEditingCategory(category._id);
    setUpdatedName(category.name);
    setUpdatedBudget(category.budget);
  };

  // Handle saving of the updated category
  const handleSaveClick = (categoryId) => {
    // Check if both fields are filled before updating
    if (!updatedName || !updatedBudget) {
      alert("Please fill in all fields");
      return;
    }

    // Call the onUpdate function with the updated data
    onUpdate(categoryId, { name: updatedName, budget: updatedBudget });

    // Reset the editing state after updating
    setEditingCategory(null);
    setUpdatedName("");
    setUpdatedBudget("");
  };

  return (
    <div>
      <h3>Category List</h3>
      <ul>
        {categories.map((category) => (
          <li key={category._id}>
            {editingCategory === category._id ? (
              <div>
                <input
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                />
                <input
                  type="number"
                  value={updatedBudget}
                  onChange={(e) => setUpdatedBudget(e.target.value)}
                />
                <button onClick={() => handleSaveClick(category._id)}>
                  Save
                </button>
                <button onClick={() => setEditingCategory(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>
                  {category.name} - Budget: ${category.budget}
                </p>
                <button onClick={() => handleEditClick(category)}>Edit</button>
                <button onClick={() => onDelete(category._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
