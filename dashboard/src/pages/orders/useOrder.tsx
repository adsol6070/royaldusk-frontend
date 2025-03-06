import { useState } from "react";
import { orderApi } from "../../common";

const useOrder = () => {
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState();

  const addOrderItem = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderApi.placeOrder(formData);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Error adding product:", err);
    }
  };

  const fetchOrderItemById = async (email) => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderApi.reacentOrderByEmail(email);
      setSelectedItem(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Error fetching menu item:", err);
    }
  };

  const deleteMenuItem = async (id) => {
    // try {
    //   setLoading(true);
    //   setError(null);
    //   await orderApi.updateOrderStatus(id); // Call the API to delete the item
    //   // Optionally, refetch the menu items or filter out the deleted item locally
    //   setMenuItems((prevItems) => prevItems.filter((item) => item._id !== id));
    //   setLoading(false);
    // } catch (err) {
    //   setLoading(false);
    //   setError(err.message);
    //   console.error("Error deleting menu item:", err);
    // }
  };

  return {
    addOrderItem,
    error,
    loading,
    selectedItem,
    fetchOrderItemById,
    deleteMenuItem,
  };
};

export default useOrder;
