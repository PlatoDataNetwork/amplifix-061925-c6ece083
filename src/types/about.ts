export interface MissionCard {
  title: string;
  description: string;
}

export interface FeatureItem {
  title: string;
  description: string;
}

export interface AboutData {
  about: {
    hero: {
      title: string;
      description: string;
    };
    mission: {
      cards: MissionCard[];
    };
    features: {
      title: string;
      items: FeatureItem[];
    };
  };
}