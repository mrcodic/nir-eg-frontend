export interface IFooterData {
  image: string;
  description: string;
  contacts: Contacts;
  social: ISocialLink[];
  pages: Pages;
}

export interface Contacts {
  phone_1: string;
  phone_2: string;
  email: string;
  location: string;
}

export interface ISocialLink {
  key: "facebook" | "tiktok" | "snapchat" | "instagram";
  url: string;
}

export interface Pages {
  terms: string;
  privacy: string;
}
