import React, { useState, useEffect } from "react";
import AddExpense from "./AddExpense";
import ExpensesList from "./ExpensesList";
import {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  getCategories,
  updateCategorySpent,
} from "../services/api";

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryBalances, setCategoryBalances] = useState({});

  // Fetch expenses and categories on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const expensesResponse = await getExpenses();
        console.log("Fetched expenses:", expensesResponse);
        const categoriesResponse = await getCategories();

        setExpenses(expensesResponse || []);
        setCategories(categoriesResponse);

        // Recalculate category balances when data is fetched
        const initialBalances = calculateCategoryBalances(
          expensesResponse,
          categoriesResponse
        );
        setCategoryBalances(initialBalances);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []); // This runs once when the component mounts

  // Recalculate category balances whenever expenses or categories change
  useEffect(() => {
    if (expenses.length > 0 && categories.length > 0) {
      const updatedBalances = calculateCategoryBalances(expenses, categories);
      setCategoryBalances(updatedBalances);
    }
  }, [expenses, categories]); // Dependency array ensures it's recalculated on any change
  // Calculate the budget, balance, and expenses for each category
  const calculateCategoryBalances = (
    expensesList = [],
    categoriesList = []
  ) => {
    const groupedExpenses = expensesList.reduce((acc, expense) => {
      const categoryId = expense.category?._id || expense.category;
      if (!categoryId) return acc;

      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(expense);
      return acc;
    }, {});

    const balances = {};
    categoriesList.forEach((category) => {
      const categoryExpenses = groupedExpenses[category._id] || [];
      const totalExpenses = categoryExpenses.reduce(
        (sum, expense) => sum + (expense.amount || 0),
        0
      );

      balances[category._id] = {
        budget: category.budget || 0,
        expenses: totalExpenses,
        balance: (category.budget || 0) - totalExpenses,
      };
    });

    return balances;
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

      // Recalculate balances after updating the expense
      await updateCategorySpent(updatedExpense.category, updatedExpense.amount);
      const updatedBalances = calculateCategoryBalances(
        updatedExpenses,
        categories
      );
      setCategoryBalances(updatedBalances);
    }
  };
  useEffect(() => {
    console.log("Updated Categories:", categories);
  }, [categories]); // Will log whenever categories state changes
  // Handle adding a new expense
  const handleAddExpense = async (newExpense) => {
    console.log("Sending Expense Data:", newExpense); // Log to confirm category is a string

    try {
      // Ensure category is just the ID string (not an object)
      const expensePayload = {
        ...newExpense,
        category: newExpense.category._id || newExpense.category, // If category is an object, use its _id
      };

      const addedExpense = await addExpense(expensePayload, setCategories);
      if (addedExpense) {
        setExpenses((prevExpenses) => [...prevExpenses, addedExpense]);

        const updatedBalances = calculateCategoryBalances(
          [...expenses, addedExpense],
          categories
        );
        setCategoryBalances(updatedBalances);

        const updatedCategory = categories.find(
          (category) => category._id === addedExpense.category
        );
        if (updatedCategory) {
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category._id === updatedCategory._id ? updatedCategory : category
            )
          );
        }
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div>
      <h2>Expenses</h2>
      <AddExpense
        onAddExpense={handleAddExpense}
        categories={categories}
        setCategories={setCategories}
      />
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
