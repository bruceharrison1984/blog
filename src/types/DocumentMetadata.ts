export type DocumentMetadata = {
  title: string;
  metaDesc?: string;
  headerImage?: string;
  date?: string;
  tags?: string[];
  legacyUrl?: string;
  currentUrl: string;
};
