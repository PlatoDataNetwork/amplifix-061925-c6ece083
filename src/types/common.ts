export interface CommonData {
  common: {
    branding_name: string;
    branding_description: string;
    nav_menu: Array<{
      label: string;
    }>;
    nav_cta_label: string;
    footer_platform_title: string;
    footer_platform_links: Array<{
      label: string;
    }>;
    footer_solutions_title: string;
    footer_solutions_links: Array<{
      label: string;
    }>;
    footer_company_title: string;
    footer_email: string;
    footer_status_text: string;
    footer_status_indicator: string;
    footer_legal_links: Array<{
      label: string;
    }>;
    footer_copyright: string;
    blog_title: string;
    blog_back_text: string;
  };
}
