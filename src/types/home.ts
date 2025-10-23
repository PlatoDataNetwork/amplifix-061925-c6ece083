export interface HomeData {
  home: {
    hero: {
      badge: string;
      title: string;
      description: string;
      buttons: {
        primary: string;
        secondary: string;
      };
    };
    about: {
      title: string;
      description: string;
      features: Array<{
        title: string;
        description: string;
      }>;
    };
    features: {
      title: string;
      description: string;
      items: Array<{
        title: string;
        description: string;
      }>;
    };
    solutions: {
      title: string;
      description: string;
      public_companies: {
        title: string;
        items: Array<{
          title: string;
          description: string;
        }>;
      };
      private_companies: {
        title: string;
        items: Array<{
          title: string;
          description: string;
        }>;
      };
    };
    stats: Array<{
      value: string;
      label: string;
    }>;
    faq: {
      title: string;
      description: string;
      items: Array<{
        question: string;
        answer: string;
      }>;
    };
    contact: {
      title: string;
      description: string;
      form: {
        title: string;
        fields: {
          company_name: {
            label: string;
            placeholder: string;
          };
          email: {
            label: string;
            placeholder: string;
          };
          company_type: {
            label: string;
            options: string[];
          };
          message: {
            label: string;
            placeholder: string;
          };
        };
        submit_button: string;
      };
      contact_info: Array<{
        title: string;
        description: string;
        contact?: string;
        additional?: string;
      }>;
    };
  };
}