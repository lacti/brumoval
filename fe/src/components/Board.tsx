import * as R from 'rambda';
import * as React from 'react';
import {
  asPlayerImage,
  IBoardSlotState,
  IBoardState,
  IPlayerState,
} from '../models/client';

const Slot: React.StatelessComponent<{ slot: IBoardSlotState }> = ({
  slot,
}) => {
  return (
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
};

const Rank: React.StatelessComponent<{ player: IPlayerState }> = ({
  player,
}) => (
  <React.Fragment>
    <img
      className="Character"
      key={player.id}
      src={asPlayerImage(player.asset)}
    />
    <span>{player.name}</span>
    <span>({player.money})</span>
  </React.Fragment>
);

const Billboard: React.StatelessComponent<{ billboard: IPlayerState[] }> = ({
  billboard,
}) => {
  window.console.log(billboard);
  return (
    <ul className="Billboard">
      {billboard.map(player => (
        <li key={player.id}>
          <Rank player={player} />
        </li>
      ))}
    </ul>
  );
};

export const Board: React.StatelessComponent<{ board: IBoardState }> = ({
  board,
}) => {
  const { slots, length, billboard } = board;
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
              <Slot key={row} slot={slots[4 + 4 * length - 1 - row]} />
            </td>
            {row === 0 && (
              <td colSpan={length} rowSpan={length} className="Status">
                <Billboard billboard={billboard} />
              </td>
            )}
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
