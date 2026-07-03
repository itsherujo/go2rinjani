export interface NavItem {
  label: string;
  url: string;
}

export interface SocialItem {
  platform: string;
  handle: string;
  url: string;
}

export interface LicenseItem {
  label: string;
  value: string;
}

export interface CompanyInfo {
  name: string;
  address: string;
  mapsUrl: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  socials: {
    whatsapp: string;
    instagram: string;
    facebook: string;
  };
  licenses: {
    nib: string;
    npwp: string;
    pbPwja: string;
  };
  copyright: string;
}
