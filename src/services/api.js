import axios from "axios";

// Correct path if api.js is inside src/services/

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const updateCategoriesState = (categories, updatedCategory) => {
  return categories.map((cat) =>
    cat._id === updatedCategory._id ? updatedCategory : cat
  );
};

export const getExpenses = async () => {
  try {
    const response = await api.get("/expenses");
    console.log("Raw response:", response); // Debug raw response

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching expenses:",
      error.response?.data || error.message
    );
    return [];
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories", error);
    return [];
  }
};

export const addExpense = async (expense, setCategories) => {
  if (typeof setCategories !== "function") {
    console.error("setCategories is not a function");
    return;
  }
  console.log("setCategories:", setCategories);
  try {
    const response = await api.post("/expenses", expense);
    console.log("Response:", response.data); // Log successful response
    console.log("expense:", expense);
    if (response.data && response.data.category) {
      const updatedCategory = response.data.category;
      setCategories((prevCategories) =>
        updateCategoriesState(prevCategories, updatedCategory)
      );
    }
    return response.data.expense;
  } catch (error) {
    console.error("Error adding expense:", error);
    return null;
  }
};

export const addCategory = async (category) => {
  try {
    const response = await api.post("/categories", category);

    // After adding, fetch the updated list of categories
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    return [];
  }
};
// Update category
export const updateCategory = async (id, updatedData, setCategories) => {
  try {
    const response = await api.put(`/categories/${id}`, updatedData);

    setCategories((prevCategories) =>
      updateCategoriesState(prevCategories, response.data)
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    return null;
  }
};

// Delete category
export const deleteCategory = async (id) => {
  try {
    await api.delete(`/categories/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    return false;
  }
};

// Update expense
export const updateExpense = async (id, updatedExpense) => {
  console.log("Updating expense with data:", updatedExpense); // Debugging log

  try {
    const response = await api.put(`/expenses/${id}`, updatedExpense);
    return response.data;
  } catch (error) {
    console.error("Error updating expense:", error);
    return null;
  }
};

// Delete expense
export const deleteExpense = async (id) => {
  try {
    await api.delete(`/expenses/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting expense:", error);
    return false;
  }
};

export const updateCategorySpent = async (categoryId, amount) => {
  try {
    const response = await api.put("/categories/update-category-spent", {
      categoryId,
      amount,
    });
    console.log("Category updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error.response?.data || error);
    console.error("Error updating category:", error.response?.data || error);
  }
};
