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
  can_buy_points: boolean;
  category: string;
  category_label: string;
  points_price: number | null;
}

export type BookLinksSettings = {
  hide_books: number;
  links: {
    id: number;
    url: string;
  }[];
};
