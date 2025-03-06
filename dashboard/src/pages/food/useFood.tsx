import { useEffect, useState } from "react";
import { menuApi } from "../../common";

const useAddMenu = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const addMenuItem = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await menuApi.createMenu(formData);
      setLoading(false);
      return response.data; 
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Error adding product:", err);
    }
  };
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await menuApi.getMenu();
      setMenuItems(response.data.menu);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Error fetching menu items:", err);
    }
  };

  const fetchMenuItemById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await menuApi.getMenuById(id);
      setSelectedItem(response.data.menu);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Error fetching menu item:", err);
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await menuApi.deleteMenu(id); // Call the API to delete the item
      // Optionally, refetch the menu items or filter out the deleted item locally
      setMenuItems((prevItems) => prevItems.filter((item) => item._id !== id));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Error deleting menu item:", err);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);
  return {
    addMenuItem,
    loading,
    error,
    menuItems,
    selectedItem,
    fetchMenuItemById,
    deleteMenuItem,
  };
};

export default useAddMenu;


