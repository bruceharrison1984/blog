import { ListItem, ListItemProps } from './Item';

type ItemListProps = {
  items: ListItemProps[];
};

const ItemList = ({ items }: ItemListProps) => (
  <div className="space-y-2 flex flex-col items-center">
    {items?.map(({ imageSrc, title, description, url }) => (
      <ListItem
        key={title}
        imageSrc={imageSrc || '/assets/posts/default.png'}
        title={title}
        url={url}
        description={description}
      />
    ))}
  </div>
);

export default ItemList;
