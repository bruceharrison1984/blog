import { ListItem, ListItemProps } from './Item';

type ItemListProps = {
  items: ListItemProps[];
};

const ItemList = ({ items }: ItemListProps) => {
  return (
    <div className="space-y-2 flex flex-col items-center">
      {items?.map(({ imageSrc, title, description, url, tags }) => (
        <ListItem
          key={title}
          imageSrc={imageSrc || '/assets/posts/default.png'}
          title={title}
          url={url}
          description={description}
          tags={tags}
        />
      ))}
    </div>
  );
};
export default ItemList;
