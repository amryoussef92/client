import React, { useState } from "react";
import { addExpense } from "../services/api";

const AddExpense = ({ onAddExpense, categories }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCategory = categories.find((cat) => cat.name === category);

    const newExpense = {
      description,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
      category: selectedCategory ? selectedCategory._id : null,
    };

    try {
      const addedExpense = await addExpense(newExpense);

      if (addedExpense) {
        onAddExpense({
          ...newExpense,
          _id: addedExpense._id,
          category: selectedCategory,
        });
      }

      setDescription("");
      setAmount("");
      setCategory("");
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  return (
    <div>
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default AddExpense;
