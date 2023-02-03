import { PostListItem, PostListItemProps } from './PostListItem';

type PostListProps = {
  items: PostListItemProps[];
};

const PostList = ({ items }: PostListProps) => (
  <div className="space-y-2 flex flex-col items-center">
    {items?.map(({ imageSrc, title, description, url, tags, publishDate }) => (
      <PostListItem
        key={title}
        imageSrc={imageSrc || '/assets/posts/default.png'}
        title={title}
        url={url}
        description={description}
        tags={tags}
        publishDate={publishDate}
      />
    ))}
  </div>
);

export default PostList;
