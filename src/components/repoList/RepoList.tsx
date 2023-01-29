import { RepoListItem } from './RepoListItem';
import { RepoMetadata } from '@/types/RepoMetadata';

type RepoListProps = {
  repos: RepoMetadata[];
};

const RepoList = ({ repos }: RepoListProps) => {
  return (
    <div className="space-y-2 flex flex-col items-center">
      {repos?.map((repo) => (
        <RepoListItem key={repo.full_name} {...repo} />
      ))}
    </div>
  );
};
export default RepoList;
