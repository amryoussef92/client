import React, { useState, useEffect } from "react";
import axios from "axios";
import AddExpense from "./AddExpense";
import ExpensesList from "./ExpensesList";
import { deleteExpense, updateExpense, getCategories } from "../services/api";

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryBalances, setCategoryBalances] = useState({});

  // Fetch expenses and categories on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const expensesResponse = await axios.get(
          "http://localhost:5000/api/expenses"
        );
        const categoriesResponse = await getCategories();

        setExpenses(expensesResponse.data);
        setCategories(categoriesResponse);

        // Recalculate category balances when data is fetched
        calculateCategoryBalances(expensesResponse.data, categoriesResponse);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []); // This runs once when the component mounts

  // Recalculate category balances whenever expenses or categories change
  useEffect(() => {
    if (expenses.length > 0 && categories.length > 0) {
      calculateCategoryBalances(expenses, categories);
    }
  }, [expenses, categories]); // Dependency array ensures it's recalculated on any change
  // Calculate the budget, balance, and expenses for each category
  const calculateCategoryBalances = (expensesList, categoriesList) => {
    const balances = {};

    categoriesList.forEach((category) => {
      const categoryExpenses = expensesList.filter(
        (expense) => expense.category === category._id
      );
      const totalExpenses = categoryExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      balances[category._id] = {
        budget: category.budget || 0,
        expenses: totalExpenses,
        balance: (category.budget || 0) - totalExpenses,
      };
    });

    // Update state after calculating balances
    setCategoryBalances(balances);
  };

  // Handle deletion of an expense
  const handleDeleteExpense = async (id) => {
    const isDeleted = await deleteExpense(id);
    if (isDeleted) {
      const updatedExpenses = expenses.filter((expense) => expense._id !== id);
      setExpenses(updatedExpenses);
      calculateCategoryBalances(updatedExpenses, categories);
    }
  };

  // Handle updating an expense
  const handleUpdateExpense = async (id, updatedData) => {
    const updatedExpense = await updateExpense(id, updatedData);
    if (updatedExpense) {
      const updatedExpenses = expenses.map((expense) =>
        expense._id === id ? { ...expense, ...updatedData } : expense
      );
      setExpenses(updatedExpenses);
      calculateCategoryBalances(updatedExpenses, categories);
    }
  };

  // Handle adding a new expense
  const handleAddExpense = (newExpense) => {
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    calculateCategoryBalances(updatedExpenses, categories);
  };

  return (
    <div>
      <h2>Expenses</h2>
      <AddExpense onAddExpense={handleAddExpense} categories={categories} />
      <ExpensesList
        expenses={expenses}
        onDelete={handleDeleteExpense}
        onUpdate={handleUpdateExpense}
        categoryBalances={categoryBalances}
      />
      {/* <div>
        <h3>Category Balances</h3>
        {Object.entries(categoryBalances).map(([categoryId, balanceData]) => (
          <p key={categoryId}>
            <strong>Category ID: {categoryId}</strong>
            <br />
            Budget: ${balanceData.budget.toFixed(2)}
            <br />
            Total Expenses: ${balanceData.expenses.toFixed(2)}
            <br />
            Balance: ${balanceData.balance.toFixed(2)}
          </p>
        ))}
      </div> */}
    </div>
  );
};

export default ExpensesPage;
