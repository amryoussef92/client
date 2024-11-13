// components/CategoriesPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import NewCategoryForm from "./NewCategoryForm";
import CategoryList from "./CategoryList";
import { deleteCategory, updateCategory } from "../services/api";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = async (id) => {
    const isDeleted = await deleteCategory(id);
    if (isDeleted) {
      fetchCategories(); // Refresh categories after deletion
    }
  };

  const handleUpdateCategory = async (id, updatedData) => {
    const updatedCategory = await updateCategory(id, updatedData);
    if (updatedCategory) {
      fetchCategories(); // Refresh categories after update
    }
  };

  return (
    <div>
      <h2>Categories</h2>
      <NewCategoryForm refreshCategories={fetchCategories} />
      <CategoryList
        categories={categories}
        onDelete={handleDeleteCategory}
        onUpdate={handleUpdateCategory}
      />
    </div>
  );
};

export default CategoriesPage;
