export enum StoreItemPaymentType {
  Cash = 1,
  Points = 2,
  CashOrPoints = 3,
}

export interface StoreItem {
  category: string;
  description: string;
  grade_id: number;
  grade_name: string;
  has_promo_code: boolean;
  id: number;
  image: string | null;
  name: string;
  payment_type: StoreItemPaymentType;
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
