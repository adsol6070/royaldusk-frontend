import { useState, useEffect } from "react";
import { categoryApi } from "../../common"; 

const useMenuCategories = () => {
  const [menuCategories, setMenuCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getCategory();
      setMenuCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory) return;

    try {
      const response = await categoryApi.createCategory({ name: newCategory });
      setMenuCategories([...menuCategories, response.data]);
      setNewCategory("");
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await categoryApi.deleteCategory(categoryId);
      setMenuCategories(menuCategories.filter((category) => category._id !== categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    menuCategories,
    newCategory,
    setNewCategory,
    handleCreateCategory,
    handleDeleteCategory,
  };
};

export default useMenuCategories;
