import axios from "axios";

// Correct path if api.js is inside src/services/
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const getExpenses = async () => {
  try {
    const response = await axios.get(`${API_URL}/expenses`);
    return response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories", error);
    return [];
  }
};

export const addExpense = async (expense) => {
  try {
    const response = await axios.post(`${API_URL}/expenses`, expense, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return only the new expense data
  } catch (error) {
    console.error("Error adding expense:", error);
    return null;
  }
};
export const addCategory = async (category) => {
  try {
    const response = await axios.post(`${API_URL}/categories`, category, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // After adding, fetch the updated list of categories
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    return [];
  }
};
// Update category
export const updateCategory = async (id, updatedData) => {
  try {
    const response = await axios.put(
      `${API_URL}/categories/${id}`,
      updatedData
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
    await axios.delete(`${API_URL}/categories/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    return false;
  }
};

// Update expense
export const updateExpense = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/expenses/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating expense:", error);
    return null;
  }
};

// Delete expense
export const deleteExpense = async (id) => {
  try {
    await axios.delete(`${API_URL}/expenses/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting expense:", error);
    return false;
  }
};
