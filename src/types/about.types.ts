export interface AboutFeaturesSection {
  small_description: string;
  section_title: string;
  items: AboutFeatureItem[];
  video_url: string;
}

export interface AboutFeatureItem {
  title: string;
  description: string;
}
