import { $enum } from 'ts-enum-util';
import { v1 as uuidv1 } from 'uuid';
import { nextInt } from '../utils/rand';

// tslint:disable max-classes-per-file
export enum GamePlayerAsset {
  TYPE_A,
  TYPE_B,
  TYPE_C,
  TYPE_D,
  TYPE_E,
}

export interface IGamePlayerEntry {
  asset: GamePlayerAsset;
  id: string;
  name: string;
}

export enum ActionType {
  MOVE,
  BUY_ITEM,
  USE_ITEM,
}

export interface IAction<T extends ActionType, P> {
  readonly id: string;
  readonly type: T;
  readonly payload: P;
}

export interface IMoveDiceAction
  extends IAction<ActionType.MOVE, { diceValue: number }> {}
export interface IBuyItemAction
  extends IAction<ActionType.BUY_ITEM, { itemCode: string }> {}
export interface IUseItemAction
  extends IAction<ActionType.USE_ITEM, { itemId: string; diceValue: number }> {}

export type Action = IMoveDiceAction | IBuyItemAction | IUseItemAction;

export const dice = (max: number = 6, min: number = 1) => nextInt(min, max);

export enum GameItemEffectType {
  PLUS_HP,
}

export interface IGameItem {
  effectType: GameItemEffectType;
  name: string;
  price: number;
  value: number;
}

export class ConstraintError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export interface IGameObserver {
  onGameStart: (board: GameBoard, players: GamePlayer[]) => void;
  onGameOver: (winner: GamePlayer, losers: GamePlayer[]) => void;

  onPlayerEnd: (loser: GamePlayer, board: GameBoard) => void;
  onNextTurn: (player: GamePlayer, board: GameBoard) => void;

  onActionStart: (player: GamePlayer, action: Action) => void;
  onActionEnd: (player: GamePlayer, action: Action) => void;

  onPlayerHpChanged: (
    player: GamePlayer,
    before: number,
    after: number,
  ) => void;
  onPlayerMoneyChanged: (
    player: GamePlayer,
    before: number,
    after: number,
  ) => void;
  onPlayerMoved: (player: GamePlayer, before: number, after: number) => void;
  onPlayerLoop: (player: GamePlayer, before: number, after: number) => void;

  onPlayerItemBought: (
    item: IGameItem,
    inventory: IGamePlayerInventory,
    player: GamePlayer,
  ) => void;
  onPlayerItemUsed: (
    item: IGameItem,
    inventory: IGamePlayerInventory,
    player: GamePlayer,
  ) => void;

  onCardAffected: (
    card: GameCard,
    target: GamePlayer,
    slot: GameBoardSlot,
  ) => void;
}

export class Game {
  public get over() {
    return this.winner || this.losers.length === this.players.length;
  }

  public readonly players: GamePlayer[];
  public readonly board: GameBoard;
  public readonly observer: IGameObserver;

  public readonly itemShop: {
    [itemCode: string]: IGameItem;
  };
  private turnIndex: number;
  private winner?: GamePlayer;
  private losers: GamePlayer[];

  constructor(
    slotCount: number,
    entries: IGamePlayerEntry[],
    observer: IGameObserver,
  ) {
    this.losers = [];
    this.board = new GameBoard(this, slotCount);
    this.players = entries.map(entry => new GamePlayer(this, entry));
    this.turnIndex = 0;

    this.observer = observer;
    this.observer.onGameStart(this.board, this.players);

    this.itemShop = {
      'black-bean': {
        effectType: GameItemEffectType.PLUS_HP,
        name: '검은콩',
        price: 50,
        value: 10,
      },
    };
  }

  public onGameEnd = (winner: GamePlayer) => {
    this.winner = winner;
    this.observer.onGameOver(this.winner, this.losers);
  };

  public onPlayerEnd = (loser: GamePlayer) => {
    this.losers.push(loser);
    this.observer.onPlayerEnd(loser, this.board);
  };

  public act = (action: Action) => {
    window.console.info(action);
    const currentPlayer = this.players[this.turnIndex];
    if (currentPlayer.entry.id !== action.id) {
      throw new ConstraintError('it-is-not-your-turn');
    }
    this.observer.onActionStart(currentPlayer, action);
    try {
      switch (action.type) {
        case ActionType.MOVE:
          currentPlayer.move(action.payload.diceValue);
          break;
        case ActionType.BUY_ITEM:
          currentPlayer.buyItem(action.payload.itemCode);
          break;
        case ActionType.USE_ITEM:
          currentPlayer.useItem(
            action.payload.itemId,
            action.payload.diceValue,
          );
          break;
      }
    } catch (error) {
      window.console.warn(error);
    }
    this.observer.onActionEnd(currentPlayer, action);
  };

  public moveToNextTurn = () => {
    this.turnIndex = (this.turnIndex + 1) % this.players.length;
    this.observer.onNextTurn(this.players[this.turnIndex], this.board);
  };
}

const MAX_LOOP_COUNT = 5;
const LOOP_HP_BONUS = 15;

export interface IGamePlayerInventory {
  [itemId: string]: IGameItem;
}

export class GamePlayer {
  public get hp() {
    return this.stat.hp;
  }

  public get currentPosition() {
    return this.position;
  }
  public readonly entry: IGamePlayerEntry;
  public readonly name: string;
  public readonly asset: GamePlayerAsset;
  public readonly stat: GamePlayerStat;
  private readonly game: Game;
  private position: number;
  private loopCount: number;
  private money: number;
  private inventory: IGamePlayerInventory;

  constructor(game: Game, entry: IGamePlayerEntry) {
    this.game = game;
    this.entry = entry;
    this.stat = new GamePlayerStat();
    this.position = 0;
    this.loopCount = 0;
    this.money = 0;
    this.inventory = {};
  }

  public changeHp = (amount: number) => {
    const before = this.stat.hp;
    this.stat.hp = Math.max(0, this.stat.hp + amount);
    this.game.observer.onPlayerHpChanged(this, before, this.stat.hp);

    // Retire me
    this.game.onPlayerEnd(this);
  };

  public changeMoney = (amount: number) => {
    const before = this.stat.money;
    this.stat.money = Math.max(0, this.stat.money + amount);
    this.game.observer.onPlayerMoneyChanged(this, before, this.stat.money);
  };

  public move = (delta: number) => {
    if (this.game.over) {
      throw new ConstraintError('game-is-over');
    }

    const oldPosition = this.position;
    this.position = (oldPosition + delta) % this.game.board.slotCount;
    this.game.observer.onPlayerMoved(this, oldPosition, this.position);

    // loop
    if (this.position < oldPosition) {
      const oldLoopCount = this.loopCount;
      this.loopCount++;
      if (this.loopCount >= MAX_LOOP_COUNT) {
        this.game.onGameEnd(this);
        return;
      }
      this.game.observer.onPlayerLoop(this, oldLoopCount, this.loopCount);
      this.changeHp(LOOP_HP_BONUS);
    }
    this.game.board.slots[this.position].affect(this);
  };

  public buyItem = (itemCode: string) => {
    const item = this.game.itemShop[itemCode];
    if (item.price > this.money) {
      throw new ConstraintError('not-enough-money');
    }
    this.changeMoney(-item.price);

    const itemId = uuidv1();
    this.inventory[itemId] = item;
    this.game.observer.onPlayerItemBought(item, this.inventory, this);
    return item;
  };

  public useItem = (itemId: string, diceValue: number) => {
    const item = this.inventory[itemId];
    if (!item) {
      throw new ConstraintError('no-item');
    }
    switch (item.effectType) {
      case GameItemEffectType.PLUS_HP:
        this.changeHp(item.value * diceValue);
        break;
    }
    delete this.inventory[itemId];
    this.game.observer.onPlayerItemUsed(item, this.inventory, this);
    return item;
  };
}

export class GamePlayerStat {
  public hp: number;
  public money: number;

  constructor() {
    this.hp = 0;
    this.money = 0;
  }
}

export class GameBoard {
  public readonly game: Game;
  public readonly slotCount: number;
  public readonly slots: GameBoardSlot[];

  constructor(game: Game, count: number) {
    this.game = game;
    this.slotCount = count;
    this.slots = [];
    for (let index = 0; index < this.slotCount; index++) {
      this.slots.push(new GameBoardSlot(this, index));
    }
  }
}

export class GameBoardSlot {
  public readonly board: GameBoard;
  public readonly index: number;
  private card: GameCard;

  constructor(board: GameBoard, index: number) {
    this.board = board;
    this.index = index;
    this.card = new GameCard();
  }

  public affect = (target: GamePlayer) => {
    this.card.affect(target);
    this.board.game.observer.onCardAffected(this.card, target, this);
    this.card.reset();
  };
}

export class GameCard {
  public type: GameCardType;
  public value: number;

  public reset = () => {
    this.type = $enum(GameCardType).asValueOrThrow(
      nextInt(0, $enum(GameCardType).length),
    );
    this.value = nextInt(5, 10);
  };

  public affect = (target: GamePlayer) => {
    switch (this.type) {
      case GameCardType.EMPTY:
        break;
      case GameCardType.BLACK_BEAN:
        target.changeHp(this.value);
        break;
      case GameCardType.BEER_CHICKEN:
        target.changeHp(-this.value);
        break;
    }
  };
}

export enum GameCardType {
  EMPTY,
  BLACK_BEAN,
  BEER_CHICKEN,
}
