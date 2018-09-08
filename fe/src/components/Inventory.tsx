import * as React from 'react';
import { asItemImage } from '../models/client';
import { IServerInventoryState, IServerItemState } from '../models/server';

const Item: React.StatelessComponent<{ item: IServerItemState }> = ({
  item,
}) => (
  <div>
    <img src={asItemImage(item.asset)} />
    <span>{item.name}</span>
  </div>
);

export const Inventory: React.StatelessComponent<{
  inventory: IServerInventoryState;
}> = ({ inventory }) => (
  <div>
    {inventory.items.map(each => (
      <Item item={each} />
    ))}
  </div>
);
