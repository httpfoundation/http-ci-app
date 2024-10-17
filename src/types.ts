export enum SiteType {
  React = "react",
  Nodejs = "nodejs",
  Nexjs = "nextj",
  Other = "other",
}

export interface Site {
  id: string;
  siteType: SiteType;
  name: string;
  publicUrl: string;
  port: number;
  path: string;
  token: string;
}

export type Sites = Site[];
