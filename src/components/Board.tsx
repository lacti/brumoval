import * as R from 'rambda';
import * as React from 'react';
import { Slot } from './Slot';

interface IBoardProps {
  count: number;
}

export const Board: React.SFC<IBoardProps> = ({ count }) => (
  <table className="Board">
    <tbody>
      <tr>
        {R.range(0, count + 2).map(col => (
          <td key={`r0c${col}`}>
            <Slot key={col} index={col} />
          </td>
        ))}
      </tr>
      {R.range(0, count).map(row => (
        <tr key={`r${1 + row}`}>
          <td key={`r${1 + row}c0`}>
            <Slot key={row} index={count * count - row - 2} />
          </td>
          {R.range(0, count).map(col => (
            <td key={`r${1 + row}c${1 + col}`} />
          ))}
          <td key={`r${1 + row}c${count + 1}`}>
            <Slot key={row} index={count + row + 2} />
          </td>
        </tr>
      ))}
      <tr>
        {R.range(0, count + 2).map(col => (
          <td key={`r${1 + count}c${col}`}>
            <Slot key={col} index={count + count + 1 + count + 2 - col} />
          </td>
        ))}
      </tr>
    </tbody>
  </table>
);
