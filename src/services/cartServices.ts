import { CartItem } from "@/context/booksCartStore";
import { Book } from "@/types/books.types";
import { instanceClient } from "@/utils/instanceClient";

import axios from "axios";

export const axiosInstance = axios.create({
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
    owner: {
      guest_token: string;
      type: string;
    };
  };
}

const cartServices = {
  fetchCart: async (): Promise<ServerGetCartResponse> => {
    try {
      const res = await instanceClient.get(`/cart`);
      return res.data || [];
    } catch (error) {
      console.log("🚀 ~ fetchCart ~ error:", error);
      throw error;
    }
  },

  addItem: async (item: CartItem): Promise<void> => {
    try {
      await instanceClient.post("/cart/items", {
        book_id: item.id,
        quantity: item.quantity,
      });
    } catch (error) {
      console.log("🚀 ~ addItem ~ error:", error);
      throw error;
    }
  },

  removeItem: async (id: string): Promise<void> => {
    try {
      const res = await instanceClient.delete("/cart/remove/" + id);
    } catch (error) {
      console.log("🚀 ~ removeItem ~ error:", error);
      throw error;
    }
  },

  updateItem: async (id: string, delta: number): Promise<void> => {
    try {
      const res = await instanceClient.post("/cart/items/" + id, {
        delta,
      });
    } catch (error) {
      console.log("🚀 ~ updateItem ~ error:", error);
      throw error;
    }
  },

  clearAll: async (): Promise<void> => {
    try {
      await instanceClient.delete("/cart");
    } catch (error) {
      console.log("🚀 ~ clearAll ~ error:", error);
      throw error;
    }
  },
};

export default cartServices;
