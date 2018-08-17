import * as React from 'react';

interface ISlotProps {
  index: number;
}

export const Slot: React.SFC<ISlotProps> = ({ index }) => (
  <div className="Slot">{index}</div>
);
