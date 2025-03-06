import { useEffect, useState } from "react";
import { menuApi, orderApi } from "../../common";

const useAddMenu = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [orders, setOrders] = useState([]);

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
      setMenuItems((prevItems) => prevItems.filter((item) => item._id !== id));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Error deleting menu item:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderApi.getAllOrders();
      console.log("Fetch orders get called:", response);
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Error fetching orders:", err);
    }
  };

  const submitOrder = async (orderData: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderApi.placeOrder(orderData);
      setOrders((prevOrders) => [...prevOrders, response.data.order]);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Error submitting order:", err);
      throw err; // Rethrow to handle in the component if needed
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return {
    loading,
    orders,
    fetchOrders,
    error,
    menuItems,
    selectedItem,
    fetchMenuItemById,
    deleteMenuItem,
    submitOrder,
  };
};

export default useAddMenu;
