export interface LocationForm {
  address: string[]; // address lines
  gettingHere: {
    steps: string[];
    mapEmbedSrc: string;
  };
  phoneNumbers: string[]; // formatted as "+91 87654 32109"
  emails: string[];
  openingHours: string;
}

export interface SettingsForm {
  locations: LocationForm[];
}
