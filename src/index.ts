import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { loadEnvFile } from "node:process";
import { cwd } from "node:process";

export type Value = string | string[] | number | boolean | undefined;

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

  console.log("source", lines);

  return commit as T;
}

// Should resolve  to either (  string | string[] | number | boolean | undefined)
export function resolve(
  value?: string,
): string | string[] | number | boolean | undefined {
  if (!value) return undefined;
  value = value.trim();

  // Remove surrounding quotes if present
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  // Check for boolean
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;

  // Check for number
  const num = parseFloat(value);
  if (!isNaN(num) && isFinite(num) && num.toString() === value) return num;

  // Check for array (comma separated, but not if it's a quoted string with commas)
  if (value.includes(",")) {
    return value.split(",").map((s) => s.trim());
  }

  // Default to string
  return value;
}

const env = parse<{ version: number }>(".shabbam700HyperPotionRelease");

console.log(env);
