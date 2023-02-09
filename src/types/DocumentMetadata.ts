export type DocumentMetadata = {
  title: string;
  metaDesc: string;
  headerImage?: string;
  date: Date;
  tags?: string[];
  previousPost?: SiblingDocument;
  nextPost?: SiblingDocument;
};

export type SiblingDocument = {
  title: string;
  url: string;
};
