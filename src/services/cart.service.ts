import { StoreItem } from "@/types/store.types";
import { instanceClient } from "@/utils/instanceClient";

interface ServerGetCartResponse {
  data: {
    id: number;
    items: {
      id: string;
      quantity: number;
      status: number;
      book: StoreItem;
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
      throw error;
    }
  },

  addItem: async (item: StoreItem): Promise<void> => {
    try {
      await instanceClient.post("/cart/items", {
        book_id: item.id,
      });
    } catch (error) {
      console.log("🚀 ~ addItem ~ error:", error);
      throw error;
    }
  },

  removeItem: async (id: string): Promise<void> => {
    try {
      await instanceClient.delete("/cart/remove/" + id);
    } catch (error) {
      console.log("🚀 ~ removeItem ~ error:", error);
      throw error;
    }
  },

  updateItem: async (id: string, delta: number): Promise<void> => {
    try {
      await instanceClient.post("/cart/items/" + id, {
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
