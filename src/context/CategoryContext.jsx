// src/context/CategoryContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../services/api.js";
import { showToast } from "../utils/toast.js";

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await getCategories();
        setCategories(response.data.map((c) => c.name));
      } catch (error) {
        showToast("Failed to fetch categories.", "error");
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const addNewCategory = async (category) => {
    try {
      await addCategory({ name: category });
      setCategories([...categories, category]);
      showToast("Category added successfully!", "success");
      return true;
    } catch (error) {
      showToast("Failed to add category.", "error");
      console.error("Error adding category:", error);
      return false;
    }
  };

  const updateExistingCategory = async (oldName, newName) => {
    try {
      await updateCategory(oldName, { name: newName });
      setCategories(categories.map((c) => (c === oldName ? newName : c)));
      showToast("Category updated successfully!", "success");
      return true;
    } catch (error) {
      showToast("Failed to update category.", "error");
      console.error("Error updating category:", error);
      return false;
    }
  };

  const deleteExistingCategory = async (name) => {
    try {
      await deleteCategory(name);
      setCategories(categories.filter((c) => c !== name));
      showToast("Category deleted successfully!", "success");
      return true;
    } catch (error) {
      showToast("Failed to delete category.", "error");
      console.error("Error deleting category:", error);
      return false;
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        addCategory: addNewCategory,
        editCategory: updateExistingCategory,
        deleteCategory: deleteExistingCategory,
      }}
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
