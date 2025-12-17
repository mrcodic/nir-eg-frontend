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
}

export interface FooterSocials {
  facebook: string;
  snapchat: string;
  tiktok: string;
  instagram: string;
}
