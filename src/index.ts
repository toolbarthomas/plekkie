import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";

import type { Value, Environment } from "./_types";

/**
 * Parse an environment file into a typed object.
 *
 * @template T - Expected return type (defaults to Environment)
 * @param name - File name (defaults to ".env")
 * @param context - Directory to resolve from (defaults to process cwd)
 */
export function parse<T = Environment>(name?: string, context = cwd()) {
  const source = join(context, name || ".env");

  const data = existsSync(source) && readFileSync(source);
  const lines = data && data.toString().split("\n");

  const commit =
    (lines &&
      lines.reduce<Environment>((current, line) => {
        const l = line.trim();

        if (line) {
          // Ignores comment lines
          if (l.startsWith("#") || l.startsWith("//")) {
            return current;
          }

          const [key, value] = l.split("=");

          // Prevent overwriting existing keys
          if (key && current && current[key] === undefined) {
            current[key] = resolve(value) as Value;
          }
        }

        return current;
      }, {} as Environment)) ||
    {};

  return commit as T;
}

/**
 * Resolve a string value into a typed JavaScript value.
 *
 * Handles:
 * - booleans ("true", "false")
 * - null / undefined
 * - numbers
 * - quoted strings
 * - comma-separated arrays
 *
 * @param value - Raw string value from env file
 */
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
