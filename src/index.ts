import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";

export type Value = string | string[] | number | boolean | undefined | null;

export interface Environment {
  [key: string]: Value;
}

export function parse<T = Environment>(name?: string, context = cwd()) {
  const source = join(context, name || ".env");

  const data = existsSync(source) && readFileSync(source);
  const lines = data && data.toString().split("\n");

  const commit =
    lines &&
    lines.reduce<Environment>((current, line) => {
      if (line) {
        const [key, value] = line.split("=");

        if (key && current && current[key] === undefined) {
          current[key] = resolve(value) as Value;
        }
      }

      return current;
    }, {} as Environment);

  return commit as T;
}

export function resolve(value?: string): Value {
  if (!value) {
    return undefined;
  }

  value = value.trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  const lower = value.toLowerCase();

  switch (lower) {
    case "true":
      return true;

    case "false":
      return false;

    case "null":
      return null;

    case "undefined":
      return undefined;
  }

  const num = parseFloat(value);

  if (!isNaN(num) && isFinite(num) && num.toString() === value) {
    return num;
  }

  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (value.includes(",")) {
    return value.split(",").map((s) => s.trim());
  }

  return value;
}
