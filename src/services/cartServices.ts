import { CartItem } from "@/context/booksCartStore";
import { Book } from "@/types/books.types";
import axios from "axios";
import Cookies from "js-cookie";

const isProd = process.env.NODE_ENV === "production";

export const axiosInstance = axios.create({
  baseURL: isProd ? process.env.NEXT_PUBLIC_REDIRECT_URL : "/",

  withCredentials: true,
});

interface ServerGetCartResponse {
  data: {
    id: number;
    items: {
      id: string;
      quantity: number;
      status: number;
      book: Book;
    }[];
    price: number;
  };
}

const cartServices = {
  fetchCart: async (): Promise<ServerGetCartResponse> => {
    const token = Cookies.get("auth_token");
    const res = await axiosInstance.get(`/api?url=/cart&isGuest=${!!!token}`);
    return res.data || [];
  },

  addItem: async (item: CartItem): Promise<void> => {
    await axiosInstance.post("/api?url=/cart/items", {
      book_id: item.id,
      quantity: item.quantity,
    });
  },

  removeItem: async (id: string): Promise<void> => {
    const res = await axiosInstance.delete("/api?url=/cart/remove/" + id);
  },

  updateItem: async (id: string, delta: number): Promise<void> => {
    const res = await axiosInstance.post("/api?url=/cart/items/" + id, {
      delta,
    });
  },

  clearAll: async (): Promise<void> => {
    await axiosInstance.delete("/api?url=/cart");
  },
};

export default cartServices;
