import { HashElementNode, hashElement } from 'folder-hash';
import { MarkdownFile } from '@/types/MarkdownFile';
import { existsSync, readFileSync } from 'fs';

export const getCache = async () => {
  const contentHash = await getFileHashes();
  const cacheFilename = `markdown-cache.${contentHash[0].hash.slice(0, 6)}`;

  if (!existsSync(cacheFilename))
    throw new Error('Page cache could not be located!');

  const cacheFile = readFileSync(cacheFilename);
  return JSON.parse(cacheFile.toString()) as MarkdownFile[];
};

/**
 * Gets a list of all files and their hashes from the content directory
 * @returns
 */
export const getFileHashes = async () => {
  const contentHash = await hashElement('./content', {
    files: { include: ['*.md'] },
  });

  const flattenNodes: (hashNode: HashElementNode) => HashElementNode[] = (
    hashNode: HashElementNode
  ) => {
    const hashes: HashElementNode[] = [hashNode];
    for (let index = 0; index < hashNode?.children?.length; index++) {
      hashes.push(...flattenNodes(hashNode.children[index]));
    }

    return hashes;
  };

  return flattenNodes(contentHash);
};
