export interface Book {
  id: string;
  title: string;
  quantity: number;
  name: string;
  description: string;
  image: string;
  grade_id: number;
  grade_name: string;
  price: string;
  status: number;
  status_label: string;
}

export interface CartState {
  items: Book[];
  addToCart: (book: Omit<Book, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export type BookLinksSettings = {
  hide_books: number;
  links: {
    id: number;
    url: string;
  }[];
};
