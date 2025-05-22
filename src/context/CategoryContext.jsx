// src/context/CategoryContext.jsx
import { createContext, useContext, useState } from "react";

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([
    "Algebra",
    "Geometry",
    "Calculus",
    "Trigonometry",
    "Statistics",
  ]);

  const addCategory = (newCategory) => {
    if (categories.includes(newCategory)) {
      alert("Category already exists!");
      return false;
    }
    setCategories([...categories, newCategory]);
    return true;
  };

  const editCategory = (oldCategory, newCategory) => {
    if (categories.includes(newCategory) && oldCategory !== newCategory) {
      alert("Category already exists!");
      return false;
    }
    setCategories(
      categories.map((cat) => (cat === oldCategory ? newCategory : cat))
    );
    return true;
  };

  const deleteCategory = (category) => {
    if (categories.length === 1) {
      alert("You must have at least one category!");
      return false;
    }
    setCategories(categories.filter((cat) => cat !== category));
    return true;
  };

  return (
    <CategoryContext.Provider
      value={{ categories, addCategory, editCategory, deleteCategory }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
}
