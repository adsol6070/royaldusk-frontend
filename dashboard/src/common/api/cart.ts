import { HttpClient } from "../helpers";

const accessTokenKey = "authToken";

const getAuthHeaders = (isMultipart: boolean = false) => {
  const token: string | null = localStorage.getItem(accessTokenKey);
  let headers: { [key: string]: string } = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (isMultipart) {
    headers["Content-Type"] = "multipart/form-data";
  }

  return headers;
};

interface MenuData {
  _id: string;
  name: string;
  price: string;
  image: string;
}
interface CartItem {
  menuItem: string;
  quantity: number;
}

interface CartData {
  userId: string;
  tableId: string;
  items: CartItem[];
}
function AuthService() {
  return {
    addToCart: async (cartData: CartData) => {
      try {
        return HttpClient.post(
          "cart/addToCart",
          {
            cartData,
          },
          {
            headers: getAuthHeaders(),
          }
        );
      } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
      }
    },
    getCartItems: (anonymousId: string, tableId: string) => {
      return HttpClient.get(
        `cart/getCart?anonymousId=${anonymousId}&tableId=${tableId}`,
        {
          headers: getAuthHeaders(),
        }
      );
    },
    deleteCartItem: (id: string) => {
      return HttpClient.delete(`cart/deleteCartItem/${id}`, {
        headers: getAuthHeaders(),
      });
    },
  };
}

export default AuthService();
