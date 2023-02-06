export type DocumentMetadata = {
  title: string;
  metaDesc: string;
  headerImage?: string;
  date: Date;
  tags?: string[];
  currentUrl: string;
  previousPost?: DocumentMetadata;
  nextPost?: DocumentMetadata;
};
