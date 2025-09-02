import { HttpClient } from "../helpers";

function WishlistService() {
  return {
    // Basic wishlist operations
    getWishlist: (params = {}) => {
      return HttpClient.get(`/wishlist-service/api/wishlist`, {
        params,
      });
    },
    addToWishlist: (data) => {
      return HttpClient.post(`/wishlist-service/api/wishlist`, data);
    },
    clearWishlist: () => {
      return HttpClient.delete(`/wishlist-service/api/wishlist`);
    },

    // Item-based operations
    getWishlistItem: (itemId) => {
      return HttpClient.get(`/wishlist-service/api/wishlist/item/${itemId}`);
    },
    updateWishlistItem: (itemId, data) => {
      return HttpClient.patch(`/wishlist-service/api/wishlist/item/${itemId}`, data);
    },
    removeFromWishlist: (itemId) => {
      return HttpClient.delete(`/wishlist-service/api/wishlist/item/${itemId}`);
    },

    // Check if an item exists
    checkItemInWishlist: (itemType, itemId) => {
      return HttpClient.get(`/wishlist-service/api/wishlist/check/${itemType}/${itemId}`);
    },

    // Priority filtering
    getWishlistByPriority: (priority) => {
      return HttpClient.get(`/wishlist-service/api/wishlist/priority/${priority}`);
    },

    // Count
    getWishlistCount: () => {
      return HttpClient.get(`/wishlist-service/api/wishlist/count`);
    },

    // Analytics
    getWishlistAnalytics: (params = {}) => {
      return HttpClient.get(`/wishlist-service/api/wishlist/analytics`, {
        params,
      });
    },
    getGlobalAnalytics: () => {
      return HttpClient.get(`/wishlist-service/api/wishlist/analytics/global`);
    },

    // Bulk operations
    bulkRemoveItems: (itemIds) => {
      return HttpClient.post(`/wishlist-service/api/wishlist/bulk/remove`, { itemIds });
    },
    bulkUpdatePriority: (updates) => {
      return HttpClient.patch(`/wishlist-service/api/wishlist/bulk/priority`, updates);
    },

    // Admin/Internal operations
    markNotificationSent: (data) => {
      return HttpClient.patch(`/wishlist-service/api/wishlist/notifications/sent`, data);
    },
    updateLastViewed: (data) => {
      return HttpClient.patch(`/wishlist-service/api/wishlist/last-viewed`, data);
    },
  };
}

export default WishlistService();
