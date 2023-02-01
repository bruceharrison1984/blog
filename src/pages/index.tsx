import { CertificationList } from '@/components/certificationList/CertificationList';
import { CredlyCertificate } from '@/types/CredlyCertificates';
import { GetStaticProps, NextPage } from 'next';
import { PostListItemProps } from '@/components/postList/PostListItem';
import { RepoMetadata } from '@/types/RepoMetadata';
import { getCertifications } from '@/utils/certificateFetcher';
import { getRepos } from '@/utils/repoFetcher';
import { recursivelyGetMetadata } from '@/utils/markdown';
import PostList from '@/components/postList/PostList';
import RepoList from '@/components/repoList/RepoList';

type HomePageProps = {
  posts?: PostListItemProps[];
  repos?: RepoMetadata[];
  certifications: CredlyCertificate[];
};

const Home: NextPage<HomePageProps> = ({ posts, repos, certifications }) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col items-center">
          <h2 className="w-full lg:w-2/3 font-bold mb-2">Posts</h2>
        </div>
        <PostList items={posts || []} />
      </div>
      <div>
        <div className="flex flex-col items-center">
          <h2 className="w-full lg:w-2/3 font-bold mb-2">Projects</h2>
        </div>
        <RepoList repos={repos || []} />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const postMetadata = await recursivelyGetMetadata('posts', 'content', 3);
  const repoMetadata = await getRepos(3);

  return {
    props: {
      posts: postMetadata.map<PostListItemProps>((x) => ({
        title: x.title,
        imageSrc: x.headerImage!,
        description: x.metaDesc,
        url: x.currentUrl,
        tags: x.tags,
      })),
      repos: repoMetadata,
    },
  };
};

export default Home;
