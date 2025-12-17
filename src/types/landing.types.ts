export interface WhyChooseSection {
  title: string;
  description: string;
  items: WhyChooseItem[];
}

export interface WhyChooseItem {
  title: string;
  description: string;
  icon_url: string;
}

export interface IFeature {
  icon_url: string;
  title: string;
}

export interface IContentProtectionSection {
  title: string;
  items: IFeature[];
}

export interface FaqSection {
  title: string;
  items: FaqItem[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface IPartner {
  id: number;
  name: string;
  image_url: string;
  created_at: string;
}

export interface ITestimonial {
  id: number;
  client_name: string;
  project_name: string;
  description: string;
  icon_url: string;
  created_at: string;
}
