export interface AppItem {
  id: number;
  name: string;
  description?: string;
  icon: string;
  color: string;
  status?: string;
}

export interface AppsData {
  page_title: string;
  manage_apps_button: string;
  recently_used_title: string;
  productivity_title: string;
  generative_ai_title: string;
  open_button: string;
  install_button: string;
  recentlyUsedApps: AppItem[];
  productivityApps: AppItem[];
  generativeAIApps: AppItem[];
}
