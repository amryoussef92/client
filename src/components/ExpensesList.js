import React, { useState } from "react";

const ExpensesList = ({ expenses, onDelete, onUpdate, categoryBalances }) => {
  const [editExpenseId, setEditExpenseId] = useState(null);
  const [updatedExpense, setUpdatedExpense] = useState({
    description: "",
    amount: "",
  });

  const handleEditClick = (expense) => {
    setEditExpenseId(expense._id);
    setUpdatedExpense({
      description: expense.description,
      amount: expense.amount,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = () => {
    onUpdate(editExpenseId, updatedExpense);
    setEditExpenseId(null); // Reset the editing state
    setUpdatedExpense({ description: "", amount: "" }); // Clear the form
  };

  return (
    <div>
      <h2>Expenses List</h2>
      <ul>
        {expenses && expenses.length > 0 ? (
          expenses.map((expense, index) => {
            // Correct category balance lookup
            const categoryBalance = categoryBalances[expense.category?._id];

            return (
              <li key={`${expense._id}-${index}`}>
                {editExpenseId === expense._id ? (
                  <div>
                    <input
                      type="text"
                      name="description"
                      value={updatedExpense.description}
                      onChange={handleInputChange}
                      placeholder="Description"
                    />
                    <input
                      type="number"
                      name="amount"
                      value={updatedExpense.amount}
                      onChange={handleInputChange}
                      placeholder="Amount"
                    />
                    <button onClick={handleUpdateSubmit}>Save</button>
                    <button onClick={() => setEditExpenseId(null)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <p>
                      {expense.description}: ${expense.amount} - Category:{" "}
                      {expense.category?.name || "No category available"}
                    </p>

                    {/* Show category budget and balance */}
                    {categoryBalance && (
                      <div>
                        <strong>Category: {expense.category?.name}</strong>
                        <br />
                        Budget: ${categoryBalance.budget.toFixed(2)}
                        <br />
                        Total Expenses: ${categoryBalance.expenses.toFixed(2)}
                        <br />
                        Balance: ${categoryBalance.balance.toFixed(2)}
                      </div>
                    )}
                    <button onClick={() => handleEditClick(expense)}>
                      Edit
                    </button>
                    <button onClick={() => onDelete(expense._id)}>
                      Delete
                    </button>
                  </div>
                )}
              </li>
            );
          })
        ) : (
          <p>No expenses available</p>
        )}
      </ul>
    </div>
  );
};

export default ExpensesList;
