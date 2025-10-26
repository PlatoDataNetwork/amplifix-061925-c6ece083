export interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
}

export interface ApiEndpointSection {
  name: string;
  version: string;
  endpoints: ApiEndpoint[];
}

export interface ApiFeature {
  icon: string;
  title: string;
  description: string;
}

export interface ApiTier {
  name: string;
  requests: string;
  requests_label: string;
  featured?: boolean;
  features: string[];
}

export interface ApiData {
  api: {
    navigation: {
      back_text: string;
      title: string;
    };
    hero: {
      badge_text: string;
      title: string;
      title_highlight: string;
      description: string;
      cta_primary: string;
      cta_secondary: string;
    };
    features: {
      title: string;
      items: ApiFeature[];
    };
    endpoints: {
      title: string;
      sections: ApiEndpointSection[];
    };
    quick_start: {
      title: string;
      code_title: string;
      language: string;
    };
    rate_limits: {
      title: string;
      tiers: ApiTier[];
    };
  };
}
