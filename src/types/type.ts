export interface ApiResponse<T> {
  status_code: number;
  status: boolean;
  data: T;
  message: string;
}

export interface FooterData {
  phone: string;
  phone_sa: string;
  email: string;
  socials: FooterSocials;
  address_1: string;
  address_2: string;
}

export interface FooterSocials {
  facebook: string;
  snapchat: string;
  tiktok: string;
  instagram: string;
}

export interface SelectOption {
  id: number | string;
  name: string;
}
