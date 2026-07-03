export interface NavItem {
  name: string;
  slug: string;
  active: boolean;
}

export interface NavSection {
  id: number;
  title: string;
  items: NavItem[];
}

export const navigationData: NavSection[] = [
  {
    id: 1,
    title: "LEGAL DOCUMENTS",
    items: [
      { name: "Terms and Conditions.", slug: "terms-and-conditions", active: false },
      { name: "Privacy Policy.", slug: "privacy-policy", active: false },
      { name: "Cookie Policy.", slug: "cookie-policy", active: false },
      { name: "Cancellation Policy.", slug: "cancellation-policy", active: false },
    ],
  },
];
