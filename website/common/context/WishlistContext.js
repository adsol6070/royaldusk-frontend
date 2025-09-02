"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import { wishlistApi } from "@/common/api";
import { useAuth } from "@/common/context/AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [itemsInWishlist, setItemsInWishlist] = useState(new Set());
  const [analytics, setAnalytics] = useState(null);
  const { userInfo, isAuthenticated } = useAuth();

  // Helper function to create dynamic payload based on item type
  const createWishlistPayload = useCallback((itemData) => {
    const { itemType, itemId, priority = "Medium", notes = "" } = itemData;

    const basePayload = {
      itemType,
      priority,
      notes,
    };

    // Dynamically add the appropriate ID field based on item type
    switch (itemType?.toLowerCase()) {
      case "package":
        return { ...basePayload, packageId: itemId };
      case "tour":
        return { ...basePayload, tourId: itemId };
      case "hotel":
        return { ...basePayload, hotelId: itemId };
      case "activity":
        return { ...basePayload, activityId: itemId };
      default:
        // Fallback for backward compatibility
        if (itemData.packageId) {
          return {
            ...basePayload,
            itemType: "Package",
            packageId: itemData.packageId,
          };
        } else if (itemData.tourId) {
          return { ...basePayload, itemType: "Tour", tourId: itemData.tourId };
        }
        throw new Error(`Unsupported item type: ${itemType}`);
    }
  }, []);

  // Helper function to extract item ID from wishlist item
  const getItemId = useCallback((item) => {
    return item.packageId || item.tourId || item.hotelId || item.activityId;
  }, []);

  // Helper function to update local state after wishlist changes
  const updateLocalWishlist = useCallback(
    (items) => {
      setWishlistItems(items);
      setWishlistCount(items.length);

      // Update items in wishlist set for quick lookup
      const itemIds = new Set();
      items.forEach((item) => {
        const itemId = getItemId(item);
        if (itemId) itemIds.add(itemId);
      });
      setItemsInWishlist(itemIds);
    },
    [getItemId]
  );

  // Get user's complete wishlist
  const getUserWishlist = useCallback(
    async (queryParams = {}) => {
      if (!isAuthenticated || !userInfo) return;

      try {
        setWishlistLoading(true);
        const response = await wishlistApi.getWishlist(queryParams);

        if (response.status === "success" && response.data?.items) {
          updateLocalWishlist(response.data.items);
          return response.data;
        } else {
          throw new Error("Failed to fetch wishlist");
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        toast.error("Failed to load wishlist");
        return null;
      } finally {
        setWishlistLoading(false);
      }
    },
    [isAuthenticated, userInfo, updateLocalWishlist]
  );

  // Add item to wishlist with dynamic payload
  const addToWishlist = useCallback(
    async (itemData) => {
      if (!isAuthenticated || !userInfo) {
        toast.error("Please login to add items to wishlist");
        return false;
      }

      try {
        // Create dynamic payload based on item type
        const payload = createWishlistPayload(itemData);
        const response = await wishlistApi.addToWishlist(payload);

        if (response.status === "success") {
          // Refresh wishlist to get updated data
          await getUserWishlist();
          toast.success(
            `Added ${itemData.itemType?.toLowerCase() || "item"} to wishlist`
          );
          return true;
        } else {
          throw new Error("Failed to add to wishlist");
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        const message =
          error?.response?.data?.message ||
          error.message ||
          "Failed to add to wishlist";
        toast.error(message);
        return false;
      }
    },
    [isAuthenticated, userInfo, getUserWishlist, createWishlistPayload]
  );

  // Remove item from wishlist
  const removeFromWishlist = useCallback(
    async (itemId) => {
      if (!isAuthenticated || !userInfo) return false;

      try {
        const response = await wishlistApi.removeFromWishlist(itemId);

        if (response.status === "success") {
          // Update local state immediately for better UX
          const removedItem = wishlistItems.find((item) => item.id === itemId);

          setWishlistItems((prev) => prev.filter((item) => item.id !== itemId));
          setWishlistCount((prev) => prev - 1);

          // Update itemsInWishlist set
          if (removedItem) {
            const removedItemId = getItemId(removedItem);
            if (removedItemId) {
              setItemsInWishlist((prev) => {
                const newSet = new Set(prev);
                newSet.delete(removedItemId);
                return newSet;
              });
            }
          }

          toast.success("Removed from wishlist");
          return true;
        } else {
          throw new Error("Failed to remove from wishlist");
        }
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        toast.error("Failed to remove from wishlist");
        return false;
      }
    },
    [isAuthenticated, userInfo, wishlistItems, getItemId]
  );

  // Update wishlist item (priority, notes, etc.)
  const updateWishlistItem = useCallback(
    async (itemId, updateData) => {
      if (!isAuthenticated || !userInfo) return false;

      try {
        const response = await wishlistApi.updateWishlistItem(
          itemId,
          updateData
        );

        if (response.status === "success") {
          // Update local state
          setWishlistItems((prev) =>
            prev.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    ...updateData,
                    updatedAt: new Date().toISOString(),
                  }
                : item
            )
          );
          toast.success("Wishlist item updated");
          return true;
        } else {
          throw new Error("Failed to update wishlist item");
        }
      } catch (error) {
        console.error("Error updating wishlist item:", error);
        toast.error("Failed to update wishlist item");
        return false;
      }
    },
    [isAuthenticated, userInfo]
  );

  // Check if item is in wishlist
  const checkItemInWishlist = useCallback(
    async (itemType, itemId) => {
      if (!isAuthenticated || !userInfo) return false;

      try {
        const response = await wishlistApi.checkItemInWishlist(
          itemType,
          itemId
        );
        return response.status === "success" && response.data?.inWishlist;
      } catch (error) {
        console.error("Error checking item in wishlist:", error);
        return false;
      }
    },
    [isAuthenticated, userInfo]
  );

  // Quick check if item is in wishlist (using local state)
  const isItemInWishlist = useCallback(
    (itemId) => {
      return itemsInWishlist.has(itemId);
    },
    [itemsInWishlist]
  );

  // Get wishlist item by item ID
  const getWishlistItemByItemId = useCallback(
    (itemId) => {
      return wishlistItems.find((item) => getItemId(item) === itemId);
    },
    [wishlistItems, getItemId]
  );

  // Toggle item in wishlist (add if not present, remove if present)
  const toggleWishlistItem = useCallback(
    async (itemData) => {
      const { itemId } = itemData;

      if (isItemInWishlist(itemId)) {
        // Find the wishlist item by item ID
        const wishlistItem = getWishlistItemByItemId(itemId);

        if (wishlistItem) {
          return await removeFromWishlist(wishlistItem.id);
        }
      } else {
        return await addToWishlist(itemData);
      }

      return false;
    },
    [
      isItemInWishlist,
      getWishlistItemByItemId,
      removeFromWishlist,
      addToWishlist,
    ]
  );

  // Get wishlist count
  const getWishlistCount = useCallback(async () => {
    if (!isAuthenticated || !userInfo) return 0;

    try {
      const response = await wishlistApi.getWishlistCount();

      if (response.status === "success") {
        setWishlistCount(response.data.count);
        return response.data.count;
      }
      return 0;
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
      return 0;
    }
  }, [isAuthenticated, userInfo]);

  // Get wishlist by priority
  const getWishlistByPriority = useCallback(
    async (priority) => {
      if (!isAuthenticated || !userInfo) return [];

      try {
        const response = await wishlistApi.getWishlistByPriority(priority);

        if (response.status === "success") {
          return response.data.items || [];
        }
        return [];
      } catch (error) {
        console.error("Error fetching wishlist by priority:", error);
        return [];
      }
    },
    [isAuthenticated, userInfo]
  );

  // Clear entire wishlist
  const clearWishlist = useCallback(async () => {
    if (!isAuthenticated || !userInfo) return false;

    try {
      const response = await wishlistApi.clearWishlist();

      if (response.status === "success") {
        setWishlistItems([]);
        setWishlistCount(0);
        setItemsInWishlist(new Set());
        toast.success("Wishlist cleared");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast.error("Failed to clear wishlist");
      return false;
    }
  }, [isAuthenticated, userInfo]);

  // Bulk remove items
  const bulkRemoveItems = useCallback(
    async (itemIds) => {
      if (!isAuthenticated || !userInfo) return false;

      try {
        const response = await wishlistApi.bulkRemoveItems(itemIds);

        if (response.status === "success") {
          // Update local state
          const removedItems = wishlistItems.filter((item) =>
            itemIds.includes(item.id)
          );

          setWishlistItems((prev) =>
            prev.filter((item) => !itemIds.includes(item.id))
          );
          setWishlistCount((prev) => prev - itemIds.length);

          // Update itemsInWishlist set
          setItemsInWishlist((prev) => {
            const newSet = new Set(prev);
            removedItems.forEach((item) => {
              const itemId = getItemId(item);
              if (itemId) newSet.delete(itemId);
            });
            return newSet;
          });

          toast.success(`Removed ${itemIds.length} items from wishlist`);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error bulk removing items:", error);
        toast.error("Failed to remove items");
        return false;
      }
    },
    [isAuthenticated, userInfo, wishlistItems, getItemId]
  );

  // Bulk update priority
  const bulkUpdatePriority = useCallback(
    async (itemIds, priority) => {
      if (!isAuthenticated || !userInfo) return false;

      try {
        const data = {
          itemIds,
          priority,
        };
        const response = await wishlistApi.bulkUpdatePriority(data);

        if (response.status === "success") {
          // Update local state
          setWishlistItems((prev) =>
            prev.map((item) =>
              itemIds.includes(item.id)
                ? { ...item, priority, updatedAt: new Date().toISOString() }
                : item
            )
          );
          toast.success(`Updated priority for ${itemIds.length} items`);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error bulk updating priority:", error);
        toast.error("Failed to update priority");
        return false;
      }
    },
    [isAuthenticated, userInfo]
  );

  // Get wishlist analytics
  const getWishlistAnalytics = useCallback(
    async (timeRange = "30d") => {
      if (!isAuthenticated || !userInfo) return null;

      try {
        const response = await wishlistApi.getWishlistAnalytics({ timeRange });

        if (response.status === "success") {
          setAnalytics(response.data);
          return response.data;
        }
        return null;
      } catch (error) {
        console.error("Error fetching wishlist analytics:", error);
        return null;
      }
    },
    [isAuthenticated, userInfo]
  );

  // Update last viewed
  const updateLastViewed = useCallback(
    async (itemIds) => {
      if (!isAuthenticated || !userInfo) return false;

      try {
        const response = await wishlistApi.updateLastViewed(itemIds);

        if (response.status === "success") {
          // Update local state
          setWishlistItems((prev) =>
            prev.map((item) =>
              itemIds.includes(item.id)
                ? { ...item, lastViewedAt: new Date().toISOString() }
                : item
            )
          );
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error updating last viewed:", error);
        return false;
      }
    },
    [isAuthenticated, userInfo]
  );

  // Reset wishlist state (useful for logout)
  const resetWishlistState = useCallback(() => {
    setWishlistItems([]);
    setWishlistCount(0);
    setItemsInWishlist(new Set());
    setAnalytics(null);
    setWishlistLoading(false);
  }, []);

  // Load wishlist on authentication change
  useEffect(() => {
    if (isAuthenticated && userInfo) {
      getUserWishlist();
    } else {
      resetWishlistState();
    }
  }, [isAuthenticated, userInfo, getUserWishlist, resetWishlistState]);

  const value = {
    // State
    wishlistItems,
    wishlistCount,
    wishlistLoading,
    itemsInWishlist,
    analytics,

    // Core operations
    getUserWishlist,
    addToWishlist,
    removeFromWishlist,
    updateWishlistItem,
    toggleWishlistItem,

    // Utility functions
    checkItemInWishlist,
    isItemInWishlist,
    getWishlistItemByItemId,
    getWishlistCount,
    getWishlistByPriority,
    getItemId,

    // Bulk operations
    clearWishlist,
    bulkRemoveItems,
    bulkUpdatePriority,

    // Analytics and tracking
    getWishlistAnalytics,
    updateLastViewed,

    // State management
    resetWishlistState,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
