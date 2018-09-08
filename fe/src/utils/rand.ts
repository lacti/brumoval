export const nextInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;

export const nextElement = <T>(values: T[]) =>
  values[nextInt(0, values.length)];
