// components/NewCategoryForm.js
import React, { useState } from "react";
import axios from "axios";

const NewCategoryForm = ({ refreshCategories }) => {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleNameChange = (e) => setName(e.target.value);
  const handleBudgetChange = (e) => setBudget(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const categoryData = { name, budget };
      await axios.post("http://localhost:5000/api/categories", categoryData);

      setName("");
      setBudget(0);
      setSuccess("Category created successfully!");

      refreshCategories();
    } catch (err) {
      setError("Error adding category. Please try again.");
    }
  };

  return (
    <div>
      <h3>Create New Category</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="category-name">Category Name</label>
          <input
            type="text"
            id="category-name"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>
        <div>
          <label htmlFor="category-budget">Category Budget</label>
          <input
            type="number"
            id="category-budget"
            value={budget}
            onChange={handleBudgetChange}
            required
          />
        </div>
        <button type="submit" disabled={!name || !budget}>
          Create Category
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>
    </div>
  );
};

export default NewCategoryForm;
