import { DocumentMetadata } from './DocumentMetadata';

export type MarkdownFile = {
  filepath: string;
  section: string;
  url: string;
  year: number;
  slug: string;
  hash: string;
  pageContent: string;
  metadata: DocumentMetadata;
};
