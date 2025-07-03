export interface CommonData {
  branding: {
    name: string;
    description: string;
  };
  navigation: {
    main_menu: Array<{
      label: string;
    }>;
    cta_button: {
      label: string;
    };
  };
  footer: {
    sections: {
      platform: {
        title: string;
        links: Array<{
          label: string;
        }>;
      };
      solutions: {
        title: string;
        links: Array<{
          label: string;
        }>;
      };
      company: {
        title: string;
        contact: {
          email: string;
          phone: string;
        };
        status: {
          text: string;
          indicator: string;
        };
      };
    };
    legal_links: Array<{
      label: string;
    }>;
    copyright: string;
  };
  blog: {
    header: {
      title: string;
      back_text: string;
    };
  };
}