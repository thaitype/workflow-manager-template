export interface Config<TType extends string> {
  type: TType;
}

export type Enum<T> = T[keyof T];
export type PromiseLike<T> = T | Promise<T>;
export type EnvLike = Record<string, string | undefined>;
