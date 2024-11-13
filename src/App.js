// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CategoriesPage from "./components/CategoriesPage";
import ExpensesPage from "./components/ExpensesPage";
import HomePage from "./components/HomePage";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
      </Routes>
    </>
  );
};

export default App;
