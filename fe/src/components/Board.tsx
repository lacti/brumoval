import * as R from 'rambda';
import * as React from 'react';
import { asPlayerImage, IBoardSlotState, IBoardState } from '../models/client';

const Slot: React.StatelessComponent<{ slot: IBoardSlotState }> = ({
  slot,
}) => (
  <div className="Slot">
    <div className="Players">
      {slot.players.map(player => (
        <img
          className="Character"
          key={player.id}
          src={asPlayerImage(player.asset)}
        />
      ))}
    </div>
  </div>
);

export const Board: React.StatelessComponent<{ board: IBoardState }> = ({
  board,
}) => {
  const { slots, length } = board;
  return (
    <table className="Board">
      <tbody>
        <tr>
          {R.range(0, length + 2).map(col => (
            <td key={`r0c${col}`}>
              <Slot key={col} slot={slots[col]} />
            </td>
          ))}
        </tr>
        {R.range(0, length).map(row => (
          <tr key={`r${1 + row}`}>
            <td key={`r${1 + row}c0`}>
              <Slot key={row} slot={slots[length * length - row - 2]} />
            </td>
            {R.range(0, length).map(col => (
              <td key={`r${1 + row}c${1 + col}`} />
            ))}
            <td key={`r${1 + row}c${length + 1}`}>
              <Slot key={row} slot={slots[length + row + 2]} />
            </td>
          </tr>
        ))}
        <tr>
          {R.range(0, length + 2).map(col => (
            <td key={`r${1 + length}c${col}`}>
              <Slot
                key={col}
                slot={slots[length + length + 1 + length + 2 - col]}
              />
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};
