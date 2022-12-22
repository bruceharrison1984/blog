export type DocumentMetadata = {
  title: string;
  metaDesc: string;
  headerImage?: string;
  date: Date;
  tags?: string[];
  legacyUrl?: string;
  currentUrl: string;
};
