export interface StoreItem {
  category: string;
  description: string;
  grade_id: number;
  grade_name: string;
  has_promo_code: boolean;
  id: number;
  image: string | null;
  name: string;
  //نقدي = 1، نقاط = 2، نقدي أو نقاط = 3.
  payment_type: 1 | 2 | 3;
  payment_type_label: string;
  points_price: number | null;
  price: string;
  //متاح = 0، غير متاح = 1.
  status: number;
  status_label: string;
  stock: number;
  quantity?: number;
}

export type BookLinksSettings = {
  hide_books: number;
  links: {
    id: number;
    name: string;
    url: string;
  }[];
};
