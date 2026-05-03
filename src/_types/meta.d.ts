export type Value = string | string[] | number | boolean | undefined | null;

export interface Environment {
  [key: string]: Value;
}
