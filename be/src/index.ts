import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as path from 'path';
import * as R from 'rambda';
import { $enum } from 'ts-enum-util';
import { v4 as uuidv4 } from 'uuid';
import { BoardLength, MAX_HP, ReadyCount } from './constant';
import {
  IBoardSlotState,
  IGameState,
  IPlayerState,
  ISessionState,
  PlayerAsset,
} from './state';
import { nextElement, nextInt, randomName } from './util';

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../../fe/build')));

const log = (...args: any[]) => {
  if (process.env.DEBUG) {
    console.log(args);
  }
};
const games: { [gameId: string]: IGameState } = {};

app.post('/api/checkSession', (req, res) =>
  res.json(
    (() => {
      const session = req.body as ISessionState;
      log(session);
      if (!session || !session.gameId) {
        return false;
      }
      return (
        !!games[session.gameId] &&
        !!games[session.gameId].players[session.clientId]
      );
    })(),
  ),
);
const findWaitingGame = () => {
  for (const game of Object.values(games)) {
    if (!game.running) {
      return game;
    }
  }
  return null;
};
const newGame = () => {
  const createSlots = (length: number): IBoardSlotState[] =>
    R.range(0, length * 4 + 4).map(index => ({
      index,
    }));
  const game: IGameState = {
    id: uuidv4(),
    board: {
      length: BoardLength,
      slots: createSlots(BoardLength),
    },
    running: false,
    players: {},
  };
  games[game.id] = game;
  return game;
};
const newPlayer = () => {
  const player: IPlayerState = {
    id: uuidv4(),
    hp: MAX_HP,
    asset: nextElement($enum(PlayerAsset).getValues()),
    money: 0,
    name: randomName(),
    position: 0,
    inventory: { items: [] },
  };
  return player;
};
app.post('/api/issueSession', (req, res) =>
  res.json(
    (() => {
      const game = findWaitingGame() || newGame();
      const player = newPlayer();
      game.players[player.id] = player;
      return {
        gameId: game.id,
        clientId: player.id,
      };
    })(),
  ),
);
app.post('/api/ready', (req, res) =>
  res.json(
    (() => {
      const session = req.body as ISessionState;
      log(session);
      if (!session || !session.gameId) {
        return false;
      }

      const game = games[session.gameId];
      if (!game) {
        return false;
      }
      return Object.keys(game.players).length === ReadyCount;
    })(),
  ),
);
app.post('/api/game', (req, res) =>
  res.json(
    (() => {
      const session = req.body as ISessionState;
      log(session);
      if (!session || !session.gameId) {
        return false;
      }

      const game = games[session.gameId];
      if (!game) {
        return false;
      }
      return game;
    })(),
  ),
);
app.post('/api/dice', (req, res) =>
  res.json(
    (() => {
      const session = req.body as ISessionState;
      log(session);
      if (!session || !session.gameId) {
        return false;
      }

      const game = games[session.gameId];
      if (!game) {
        return false;
      }
      const player = game.players[session.clientId];
      if (!player) {
        return false;
      }
      player.position =
        (player.position + nextInt(1, 6)) % game.board.slots.length;
      return game;
    })(),
  ),
);
app.listen(3001, () => {
  console.log('hello');
});
