import * as React from 'react';
import { IInventoryState, IItemState } from '../models/state';

const Item: React.StatelessComponent<{ item: IItemState }> = ({ item }) => (
  <div>
    <img src={item.asset} />
    <span>{item.name}</span>
  </div>
);

export const Inventory: React.StatelessComponent<{
  inventory: IInventoryState;
}> = ({ inventory }) => (
  <div>
    {inventory.items.map(each => (
      <Item item={each} />
    ))}
  </div>
);
